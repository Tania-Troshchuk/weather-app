import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherCronJobService } from './services/weather_cron_job.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private weatherService: WeatherService,
    private cronService: WeatherCronJobService,
  ) {}

  @Get()
  async getCityWeather(@Query('city') city: string) {
    if (!city) {
      throw new BadRequestException('Invalid request');
    }

    await this.cronService.sendDailyEmails();

    return this.weatherService.getWeather(city);
  }
}
