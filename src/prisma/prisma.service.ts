import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client!: PrismaClient; 
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    console.log('DB URL in PrismaService:', process.env.DATABASE_URL); 
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    try {
      await this.client.$queryRaw`SELECT 1`;
      this.logger.log('ZenithFlow connected to PostgreSQL via Driver Adapter');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      process.exit(1); 
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database');
  }

  // This getter allows you to use this.prisma.$transaction() in other services
  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }
}
