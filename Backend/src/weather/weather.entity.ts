import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from 'src/subscription/entities/subscription.entity';

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

  @OneToMany(() => Subscription, (subscription) => subscription.weather)
  subscriptions: Subscription[];
}
