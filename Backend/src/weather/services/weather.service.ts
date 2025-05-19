import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from '../weather.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherResponseDto } from '../dto/weather-response.dto';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionService } from '../../subscription/services/subscription.service';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseWeatherUrl: string;

  constructor(
    @InjectRepository(Weather) private repo: Repository<Weather>,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.apiKey = process.env.WEATHER_API_KEY ?? '';
    this.baseWeatherUrl = 'http://api.weatherapi.com/v1';
  }

  async getWeather(city: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WeatherResponseDto>(
          `${this.baseWeatherUrl}/current.json`,
          {
            params: {
              key: this.apiKey,
              q: city,
            },
          },
        ),
      );
      const currentData = response.data.current;

      const weatherData = {
        temperature: currentData.temp_c,
        humidity: currentData.humidity,
        description: currentData.condition.text,
      };

      return weatherData;
    } catch (error) {
      console.log('Error at catch: ', error?.status);
      console.log('Error at data: ', error?.response?.data?.error);

      if (error.status === 400 && error?.response?.data?.error?.code === 1006) {
        throw new NotFoundException('City not found');
      }
      throw error;
    }
  }

  async addWeather(data: {
    createData: Partial<Weather>;
    subscription: Subscription;
  }): Promise<Weather> {
    const newCityWeather = this.repo.create(data.createData);
    const weather = await this.repo.save(newCityWeather);

    return weather;
  }

  async checkSupportedCity(city: string): Promise<any[] | null> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseWeatherUrl}/search.json`, {
        params: {
          key: this.apiKey,
          q: city,
        },
      }),
    );

    return response.data;
  }
}
