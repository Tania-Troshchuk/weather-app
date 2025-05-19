import { Weather } from 'src/weather/weather.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
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

  @OneToOne(() => Weather)
  @JoinColumn()
  weather: Weather;
}
