import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './weather.entity';
import { In, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionService } from '../subscription/services/subscription.service';

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
    // this.apiKey = process.env.WEATHER_API_KEY ?? '';
    this.apiKey = '8d2d66c5d47044719eb132934251705';
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

      const subscriptions = await this.subscriptionService.getCityWeatherList(city);

      if (subscriptions?.length > 0) {
        const subscription = subscriptions[0];
        console.log('subscription for exist: ', subscription);
        if (subscription.weather) {
          await this.repo.update(subscription.weather.id, weatherData);
        } else {
          const newWeather = this.repo.create(weatherData);
          newWeather.subscription = subscription;
          await this.repo.save(newWeather);
        }
      } else {
        const newWeather = this.repo.create(weatherData);
        // Note: If no subscription exists for the city, the new weather record won't be linked to a subscription here.
        await this.repo.save(newWeather);
        console.log('new w: ', newWeather)

      }

      console.log('res.data', response.data);
      return response.data;

      // if (subscriptions?.length) {
      //   // const newData = await this.updateWeather({
      //   //   temperature: currentData.temp_c,
      //   //   humidity: currentData.humidity,
      //   //   description: currentData.condition.text,
      //   // });

      //   await this.repo.update()
      //   // newData.subscription = subscriptions[0];
      // } else {
      //   const newData = await this.addWeather({
      //     temperature: currentData.temp_c,
      //     humidity: currentData.humidity,
      //     description: currentData.condition.text,
      //   });
      //   newData.subscription = subscriptions[0];
      // }
  

      // return response.data;
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
    createData: Omit<Weather, 'id'>;
    subscription: Subscription;
  }) {
    const newCityWeather = this.repo.create(data.createData);
    newCityWeather.subscription = data.subscription;

    return this.repo.save(newCityWeather);
  }

  async updateWeather(data: {
    wheatherIds: string[];
    updateData: Omit<Weather, 'id'>[];
  }) {
    try {
      const updatePromises = data.wheatherIds.map((id) =>
        this.repo.update(id, data.updateData[id]),
      );
      const updateResult = await Promise.all(updatePromises);

      console.log('res update', updateResult)

      
    } catch (error) {}
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
