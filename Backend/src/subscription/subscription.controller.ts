import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { WeatherService } from 'src/weather/services/weather.service';
import { SubscriptionTokenService } from './services/subscription_token.service';
import { EmailService } from './services/email.service';
import { EmailTemplates } from './entities/email_template';
import { FileInterceptor } from '@nestjs/platform-express';

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
    private emailService: EmailService,
  ) {}

  @Post('subscribe')
  @UseInterceptors(FileInterceptor('formData'))
  async createSubscription(@Body() body: CreateSubscriptionDto) {
    const isExistSubscription = await this.subscriptionService.checkExisting(
      body.email,
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

    if (subscription) {
      const { subject, text } = EmailTemplates.confirmSubscription(
        subscription.confirmToken,
      );

      await this.emailService.sendMail(
        subscription.subscription.email,
        subject,
        text,
      );
    }

    return 'Subscription successful. Confirmation email sent.';
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.subscriptionTokenService.verifyAndFindSubscription(
      token,
      'confirm',
    );

    await this.subscriptionService.changeConfirmedStatus(token, true);

    return 'Subscription confirmed successfully';
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.subscriptionTokenService.verifyAndFindSubscription(
      token,
      'unsubscribe',
    );

    await this.subscriptionService.changeConfirmedStatus(token, false);

    return 'Unsubscribed successfully';
  }
}
