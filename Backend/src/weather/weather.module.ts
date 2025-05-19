import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './weather.entity';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionService } from 'src/subscription/services/subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Weather]),
    HttpModule,
    forwardRef(() => SubscriptionModule)
    // SubscriptionModule,
  ],
  exports: [WeatherService],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
