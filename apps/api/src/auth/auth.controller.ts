import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { LocalAuthGuard } from '@api/auth/guards';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
}
