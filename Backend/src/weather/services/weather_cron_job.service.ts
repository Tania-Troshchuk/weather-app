import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../../subscription/services/email.service';
import { SubscriptionTokenService } from '../../subscription/services/subscription_token.service';
import { EmailTemplates } from 'src/subscription/entities/email_template';
import { WeatherService } from './weather.service';
import { SubscriptionService } from 'src/subscription/services/subscription.service';

@Injectable()
export class WeatherCronJobService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    private readonly tokenService: SubscriptionTokenService,
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendHourlyEmails() {
    await this.sendEmailsByFrequency('hourly');
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyEmails() {
    await this.sendEmailsByFrequency('daily');
  }

  async sendEmailsByFrequency(frequency: 'hourly' | 'daily') {
    const subscriptions =
      await this.subscriptionService.getConfirmedSubscription(frequency);

    subscriptions.forEach(async (sub) => {
      const weather = await this.weatherService.getWeather(sub.city);
      const savedWeather = await this.weatherService.addWeather({
        createData: weather,
        subscription: sub,
      });

      sub.weather = savedWeather;

      const { subject, text } = EmailTemplates.weatherUpdate({
        city: sub.city,
        temperature: weather.temperature,
        humidity: weather.humidity,
        description: weather.description,
      });

      await this.emailService.sendMail(sub.email, subject, text);
    });
  }
}
