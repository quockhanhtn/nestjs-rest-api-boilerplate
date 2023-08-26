import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { RequestInfo, type RequestInfoData } from '@libs/core/request';
import { type UserEntity } from '@libs/infrastructures';

import { AuthService } from '@api/auth/auth.service';
import { CurrentUser, Public } from '@api/auth/decorators';
import { type SignUpDto } from '@api/auth/dto/sign-up.dto';
import { JwtRefreshGuard, LocalAuthGuard } from '@api/auth/guards';
import { JwtAccessGuard } from '@api/auth/guards/jwt-access.guard';
import { JwtRefreshPayload, type JwtAccessPayload } from '@api/auth/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Req() req: Request, @RequestInfo() reqInfo: RequestInfoData) {
    const authUser = req.user as UserEntity;
    return this.authService.signIn(authUser, reqInfo);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request, @RequestInfo() reqInfo: RequestInfoData) {
    const refreshPayload = req.user as JwtRefreshPayload;
    const { sub, sessionId, refreshToken } = refreshPayload;
    return this.authService.refreshToken(sub, sessionId, refreshToken, reqInfo);
  }

  @Post('me')
  @UseGuards(JwtAccessGuard)
  async me(@CurrentUser() currentUser: JwtAccessPayload) {
    return currentUser;
  }
}
