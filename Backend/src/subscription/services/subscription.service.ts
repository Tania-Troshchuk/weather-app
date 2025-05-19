import { ConflictException, Injectable } from '@nestjs/common';
import { Subscription } from '../entities/subscription.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionTokenService } from './subscription_token.service';
import { WeatherService } from '../../weather/services/weather.service';
import { Weather } from 'src/weather/weather.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private repo: Repository<Subscription>,
    private readonly tokenService: SubscriptionTokenService,
    private readonly dataSource: DataSource,
    // private readonly weatherService: WeatherService,
  ) {}

  async checkExisting(email: string) {
    const subscription = await this.repo.findOne({
      where: { email },
    });

    return !!subscription;
  }

  async getConfirmedSubscription(frequency: 'daily' | 'hourly') {
    return await this.repo.find({
      where: { confirmed: true, frequency },
      // relations: ['subscription'],
    });
  }

  async createSubscription(data: CreateSubscriptionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subscription = queryRunner.manager.create(Subscription, data);
      await queryRunner.manager.save(Subscription, subscription);

      const confirmToken = await this.tokenService.generateAndStoreToken(
        subscription,
        'confirm',
        queryRunner,
      );
      const unsubscribeToken = await this.tokenService.generateAndStoreToken(
        subscription,
        'unsubscribe',
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return {
        subscription,
        confirmToken,
        unsubscribeToken,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changeConfirmedStatus(
    token: string,
    confirmed: boolean,
  ): Promise<Subscription> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const confirmedStatus = confirmed ? 'confirm' : 'unsubscribe';
      const { subscription } = await this.tokenService.getTokenWithSubscription(
        token,
        confirmedStatus,
      );

      if (confirmed && subscription.confirmed) {
        throw new ConflictException('Subscription already confirmed.');
      }

      subscription.confirmed = confirmed;

      await queryRunner.manager.save(subscription);
      await this.tokenService.deleteToken(token, queryRunner);

      await queryRunner.commitTransaction();

      return subscription;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCitiesWeather(subscription: Subscription) {
    const updatedSubscriptions = await this.repo.save(subscription);

    return updatedSubscriptions;
  }
}
