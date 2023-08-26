import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@libs/infrastructures';

import { JwtAccessPayload } from '@api/auth/types';

export const JWT_ACCESS_STRATEGY_NAME = 'jwt-access-token';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, JWT_ACCESS_STRATEGY_NAME) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.jwt.accessToken.secret,
    });
  }

  validate(payload: JwtAccessPayload): JwtAccessPayload {
    return payload;
  }
}
