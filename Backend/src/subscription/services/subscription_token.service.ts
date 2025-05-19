import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionToken } from '../entities/subscription_token.entity';


@Injectable()
export class SubscriptionTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(SubscriptionToken)
    private readonly repo: Repository<SubscriptionToken>,
  ) {}

  async generateAndStoreToken(
    subscription: Subscription,
    type: 'confirm' | 'unsubscribe',
    queryRunner: QueryRunner,
  ): Promise<string> {
    const payload = {
      sub: subscription.id,
      type,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const tokenEntity = queryRunner.manager.create(SubscriptionToken, {
      token,
      type,
      subscription,
    });

    await queryRunner.manager.save(SubscriptionToken, tokenEntity);

    return token;
  }

  async verifyAndFindSubscription(
    token: string,
    type: 'confirm' | 'unsubscribe',
  ): Promise<Subscription> {
    try {
      this.jwtService.verify(token);
    } catch (err) {
      console.error('JWT verification failed:', err);
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new BadRequestException('Invalid token');
    }

    const tokenRecord = await this.repo.findOne({
      where: { token, type },
      relations: ['subscription'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Token not found');
    }

    return tokenRecord.subscription;
  }

  async getTokenWithSubscription(
    token: string,
    type: 'confirm' | 'unsubscribe',
  ) {
    const record = await this.repo.findOne({
      where: { token, type },
      relations: ['subscription'],
    });

    if (!record) {
      throw new NotFoundException('Invalid or expired token');
    }

    return record;
  }

  async deleteToken(token: string, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SubscriptionToken, { token });
  }
}
