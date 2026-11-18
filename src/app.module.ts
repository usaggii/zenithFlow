import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { HealthService } from './modules/health/health.service';
import { TenantMiddleware } from './common/middleware/tenant/tenant.middleware';
import { OnboardingModule } from './modules/onboarding/onboarding.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    HealthModule,
    OnboardingModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealthService],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).exclude('onboarding/register').forRoutes('*path');
  }
}
