import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from '../../subscription/services/email.service';
import { SubscriptionTokenService } from '../../subscription/services/subscription_token.service';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { EmailTemplates } from 'src/subscription/entities/email_template';

@Injectable()
export class WeatherCronJobService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    private readonly tokenService: SubscriptionTokenService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendHourlyEmails() {
    await this.sendEmailsByFrequency('hourly');
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyEmails() {
    await this.sendEmailsByFrequency('daily');
  }

  async sendEmailsByFrequency(frequency: 'hourly' | 'daily') {
    const subscriptions = await this.subscriptionRepo.find({
      where: { confirmed: true, frequency },
    });

    // for (const sub of subscriptions) {
    //   const weatherInfo = await this.getWeatherForCity(sub.city);

    //   // const unsubscribeToken = await this.tokenService.getToken

    //   const { subject, text } = EmailTemplates.weatherUpdate(weatherInfo);

    //   await this.emailService.sendMail(sub.email, subject, text);
    // }
  }
}
