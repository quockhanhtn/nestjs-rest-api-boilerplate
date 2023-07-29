import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures/config';

import { JwtAccessPayloadData, JwtRefreshPayloadData } from '../types';

export const JwtRefreshStrategyName = 'jwt-refresh-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JwtRefreshStrategyName) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.rtSecret,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtAccessPayloadData): JwtRefreshPayloadData {
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
