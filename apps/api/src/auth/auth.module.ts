import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, UsersService, LocalStrategy],
})
export class AuthModule {}
