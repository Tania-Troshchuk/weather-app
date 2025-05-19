import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { WeatherModule } from 'src/weather/weather.module';
import { SubscriptionToken } from './entities/subscription_token.entity';
import { SubscriptionTokenService } from './services/subscription_token.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionToken]),
    forwardRef(() => WeatherModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [SubscriptionService, SubscriptionTokenService, EmailService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService, SubscriptionTokenService, EmailService],
})
export class SubscriptionModule {}
