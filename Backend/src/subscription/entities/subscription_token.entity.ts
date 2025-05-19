import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity()
export class SubscriptionToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ type: 'enum', enum: ['confirm', 'unsubscribe'] })
  type: 'confirm' | 'unsubscribe';

  @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
  @JoinColumn()
  subscription: Subscription;
}
