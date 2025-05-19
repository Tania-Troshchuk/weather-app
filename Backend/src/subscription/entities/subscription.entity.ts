import { Weather } from 'src/weather/weather.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: ['hourly', 'daily'] })
  frequency: 'hourly' | 'daily';

  @Column({ default: false, nullable: true })
  confirmed: boolean;

  @ManyToOne(() => Weather, (weather) => weather.subscriptions, {
    nullable: true,
    onDelete: 'SET NULL',
  })

  @JoinColumn()
  weather: Weather;
}
