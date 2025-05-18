import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(['hourly', 'daily'])
  frequency: 'hourly' | 'daily';
}
