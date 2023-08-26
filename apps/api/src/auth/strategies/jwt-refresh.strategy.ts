import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures/config';

import { type JwtRefreshPayload } from '../types';

export const JwtRefreshStrategyName = 'jwt-refresh-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JwtRefreshStrategyName) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.jwt.refreshToken.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtRefreshPayload): JwtRefreshPayload {
    const refreshToken = req?.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return {
      sub: payload.sub,
      sessionId: payload.sessionId,
      refreshToken,
    };
  }
}
