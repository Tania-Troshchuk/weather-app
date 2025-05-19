import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './weather.entity';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherCronJobService } from './services/weather_cron_job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Weather]),
    HttpModule,
    forwardRef(() => SubscriptionModule),
  ],
  providers: [WeatherService, WeatherCronJobService],
  controllers: [WeatherController],
  exports: [WeatherService, WeatherCronJobService],
})
export class WeatherModule {}
