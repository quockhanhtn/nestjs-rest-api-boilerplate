import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures/config';

import { JwtRefreshPayloadData } from '../types';

export const JwtRefreshStrategyName = 'jwt-refresh-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JwtRefreshStrategyName) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.jwt.rtSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtRefreshPayloadData): JwtRefreshPayloadData {
    const refreshToken = req?.body?.refreshToken;

    if (!refreshToken) {
      throw new HttpException('Refresh token malformed', HttpStatus.UNAUTHORIZED);
    }

    return {
      sub: payload.sub,
      sessionId: payload.sessionId,
      refreshToken,
    };
  }
}
