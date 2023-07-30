import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserSessionService } from '../user-session/user-session.service';
import { UserService } from '../user/user.service';
import { JwtAccessStrategy, JwtRefreshStrategy } from './';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, UserService, UserSessionService],
})
export class AuthModule {}
