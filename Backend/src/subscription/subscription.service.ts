import { Injectable } from '@nestjs/common';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
  ) {}

  async checkExisting(city: string, email: string) {
    const subscription = await this.repo.findOne({ where: { city, email } });

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
    const newSubscription = this.repo.create(data);

    return this.repo.save(newSubscription);
  }
}
