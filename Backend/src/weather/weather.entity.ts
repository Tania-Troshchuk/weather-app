import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // CreateDateColumn
} from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  temperature: number;

  @Column({ nullable: true })
  humidity: number;

  @Column({ nullable: true })
  description: string;

  // @CreateDateColumn() if realize without cron-job can be used this field to check when weather will become outdated
  // createdAt: Date;
}
