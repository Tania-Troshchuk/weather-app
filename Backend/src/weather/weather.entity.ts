import { Subscription } from 'src/subscription/subscription.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  // CreateDateColumn
} from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'float' })
  temperature: number;

  @Column({ nullable: true, type: 'float' })
  humidity: number;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => Subscription, (subscription) => subscription.weather)
  subscription: Subscription;

  // @CreateDateColumn() if realize without cron-job can be used this field to check when weather will become outdated
  // createdAt: Date;
}
