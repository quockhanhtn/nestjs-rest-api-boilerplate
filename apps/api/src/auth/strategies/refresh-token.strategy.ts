import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures/config';

import { AuthPayload, AuthPayloadWithRefresh } from '../types';

export const RefreshTokenStrategyName = 'jwt-strategy-rt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, RefreshTokenStrategyName) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.rtSecret,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: AuthPayload): AuthPayloadWithRefresh {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new HttpException('Refresh token malformed', HttpStatus.UNAUTHORIZED);
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
