import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './services/weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  getCityWeather(@Query('city') city: string) {
    if (!city) {
      throw new BadRequestException('Invalid request');
    }

    return this.weatherService.getWeather(city);
  }
}
