import { ConflictException, Injectable } from '@nestjs/common';
import { Subscription } from '../entities/subscription.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionTokenService } from './subscription_token.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
    private readonly tokenService: SubscriptionTokenService,
    private readonly dataSource: DataSource,
  ) {}

  async checkExisting(email: string) {
    const subscription = await this.repo.findOne({
      where: { email, confirmed: true },
    });

    return !!subscription;
  }

  async getCityWeatherList(city: string) {
    const subscriptions = await this.repo.find({
      where: { city },
      relations: ['weather'],
    });
    console.log('subscriptions', subscriptions);
    return subscriptions;
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
  ): Promise<string> {
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
      return 'Subscription confirmed successfully.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
