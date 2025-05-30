import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './subscription.controller';
import { WeatherModule } from '../weather/weather.module';
import { SubscriptionToken } from './entities/subscription_token.entity';
import { EmailService } from './services/email.service';
import { SubscriptionTokenService } from './services/subscription_token.service';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionToken]),
    forwardRef(() => WeatherModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [SubscriptionService, SubscriptionTokenService, EmailService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService, SubscriptionTokenService, EmailService],
})
export class SubscriptionModule {}
