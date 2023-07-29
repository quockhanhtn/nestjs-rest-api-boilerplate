import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtAccessStrategy, JwtRefreshStrategy } from './';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, UsersService],
})
export class AuthModule {}
