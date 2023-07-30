import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RequestLoggerMiddleware } from '@libs/core/request';
import { ConfigModule, MongodbModule } from '@libs/infrastructures';

import { JwtAccessGuard } from './auth';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserSessionModule } from './user-session/user-session.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, MongodbModule, AuthModule, UserModule, HealthModule, UserSessionModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
