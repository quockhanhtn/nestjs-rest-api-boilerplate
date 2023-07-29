import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequestInfo, RequestInfoData } from '@libs/core/request';

import {
  JwtAccessPayload,
  JwtAccessPayloadData,
  JwtRefreshGuard,
  JwtRefreshPayload,
  JwtRefreshPayloadData,
  Public,
  TokenPair,
} from './';
import { AuthService } from './auth.service';
import { AuthOutputDto, LoginInputDto, RegisterInputDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() body: RegisterInputDto,
    @RequestInfo() reqInfo: RequestInfoData,
  ): Promise<TokenPair> {
    console.log('meta', reqInfo);
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() body: LoginInputDto,
    @RequestInfo() reqInfo: RequestInfoData,
  ): Promise<AuthOutputDto> {
    return this.authService.login(body.account, body.password, reqInfo);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@JwtAccessPayload() authPayload: JwtAccessPayloadData) {
    return this.authService.logout(authPayload.sub);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@JwtRefreshPayload() authPayload: JwtRefreshPayloadData) {
    return this.authService.refreshToken(authPayload.sub, authPayload.refreshToken);
  }
}
