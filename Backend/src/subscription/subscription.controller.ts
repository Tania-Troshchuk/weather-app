import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { WeatherService } from 'src/weather/weather.service';
import { SubscriptionTokenService } from './services/subscription_token.service';

@Controller()
// @UsePipes(
//   new ValidationPipe({
//     exceptionFactory: (errors) => new BadRequestException('Invalid input'),
//   }),
// )
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private subscriptionTokenService: SubscriptionTokenService,
    private weatherService: WeatherService,
  ) {}

  @Post('subscribe')
  async createSubscription(@Body() body: CreateSubscriptionDto) {
    const isExistSubscription = await this.subscriptionService.checkExisting(
      body.email
    );

    if (isExistSubscription) {
      throw new ConflictException('Email already subscribed');
    }

    const supportedCities = await this.weatherService.checkSupportedCity(
      body.city,
    );

    if (!supportedCities?.length) {
      throw new BadRequestException('Invalid input');
    }

    const subscription =
      await this.subscriptionService.createSubscription(body);

    return subscription;
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string): Promise<string> {
    await this.subscriptionTokenService.verifyAndFindSubscription(
      token,
      'confirm',
    );

    return await this.subscriptionService.changeConfirmedStatus(token, true);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string): Promise<string> {
    await this.subscriptionTokenService.verifyAndFindSubscription(
      token,
      'unsubscribe',
    );

    return await this.subscriptionService.changeConfirmedStatus(token, false);
  }
}
