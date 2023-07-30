import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequestInfo, RequestInfoData } from '@libs/core/request';

import { JwtRefreshGuard, JwtRefreshPayload, JwtRefreshPayloadData, Public } from './';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterInputDto, @RequestInfo() reqInfo: RequestInfoData) {
    return this.authService.register(body, reqInfo);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginInputDto, @RequestInfo() reqInfo: RequestInfoData) {
    return this.authService.login(body.account, body.password, reqInfo);
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  logout(@JwtRefreshPayload() refreshPayload: JwtRefreshPayloadData) {
    const { sessionId, refreshToken } = refreshPayload;
    return this.authService.logout(sessionId, refreshToken);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @JwtRefreshPayload() refreshPayload: JwtRefreshPayloadData,
    @RequestInfo() reqInfo: RequestInfoData,
  ) {
    const { sub, sessionId, refreshToken } = refreshPayload;
    return this.authService.refreshToken(sub, sessionId, refreshToken, reqInfo);
  }
}
