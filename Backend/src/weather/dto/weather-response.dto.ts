export class WeatherResponseDto {
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
}
