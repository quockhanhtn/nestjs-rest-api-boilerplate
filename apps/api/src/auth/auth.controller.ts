import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetRequestMetadata, RequestMetadata } from '@libs/core/request';

import {
  AuthPayload,
  AuthPayloadWithRefresh,
  GetAuthPayload,
  GetAuthPayloadWithRefresh,
  Public,
  JwtRefreshGuard,
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
    @GetRequestMetadata() meta: RequestMetadata,
  ): Promise<TokenPair> {
    console.log('meta', meta);
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() body: LoginInputDto,
    @GetRequestMetadata() meta: RequestMetadata,
  ): Promise<AuthOutputDto> {
    return this.authService.login(body.account, body.password, meta);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetAuthPayload() authPayload: AuthPayload) {
    return this.authService.logout(authPayload.sub);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@GetAuthPayloadWithRefresh() authPayload: AuthPayloadWithRefresh) {
    return this.authService.refreshToken(authPayload.sub, authPayload.refreshToken);
  }
}
