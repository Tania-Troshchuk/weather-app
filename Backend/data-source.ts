import { DataSource } from 'typeorm';
import { Weather } from './src/weather/weather.entity';
import { Subscription } from './src/subscription/subscription.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 0),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [Weather, Subscription],
  migrations: ['dist/migrations/*{.js, .ts}'],
});

export default AppDataSource;
