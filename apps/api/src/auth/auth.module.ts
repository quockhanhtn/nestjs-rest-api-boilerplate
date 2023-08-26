import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserSessionsService } from '@api/user-sessions/user-sessions.service';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy, LocalStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, UsersService, UserSessionsService, LocalStrategy, JwtAccessStrategy],
})
export class AuthModule {}
