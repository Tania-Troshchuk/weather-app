import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { WeatherService } from 'src/weather/weather.service';

@Controller()
// @UsePipes(
//   new ValidationPipe({
//     exceptionFactory: (errors) => new BadRequestException('Invalid input'),
//   }),
// )
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private weatherService: WeatherService,
  ) {}

  @Post('subscribe')
  async createSubscription(@Body() body: CreateSubscriptionDto) {
    const isExistSubscription = await this.subscriptionService.checkExisting(
      body.city,
      body.email,
    );

    if (isExistSubscription) {
      throw new ConflictException('Email already subscribed');
    }

    const supportedCities = await this.weatherService.checkSupportedCity(body.city);

    if (!supportedCities?.length) {
      throw new BadRequestException('Invalid input');
    }

    const subscription =
      await this.subscriptionService.createSubscription(body);

    return subscription;
  }
}
