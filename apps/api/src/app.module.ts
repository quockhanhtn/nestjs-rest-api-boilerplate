import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RequestLoggerMiddleware } from '@libs/core/request';
import { ConfigModule, MongodbModule } from '@libs/infrastructures';

import { AuthModule } from '@api/auth/auth.module';
import { CategoriesModule } from '@api/categories/categories.module';
import { HealthModule } from '@api/health/health.module';
import { UserSessionsModule } from '@api/user-sessions/user-sessions.module';
import { UsersModule } from '@api/users/users.module';

@Module({
  imports: [
    ConfigModule,
    MongodbModule,
    AuthModule,
    UsersModule,
    HealthModule,
    UserSessionsModule,
    CategoriesModule,
  ],
  controllers: [],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAccessGuard,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
