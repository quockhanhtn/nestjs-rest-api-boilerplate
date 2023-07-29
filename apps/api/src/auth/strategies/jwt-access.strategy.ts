import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures/config';

import { AuthPayload } from '../types';

export const JwtAccessStrategyName = 'jwt-access-strategy';
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, JwtAccessStrategyName) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.atSecret,
    });
  }

  validate(payload: AuthPayload) {
    console.log('payload', payload);
    return payload;
  }
}
