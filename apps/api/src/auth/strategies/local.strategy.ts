import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@api/auth/auth.service';

export const LOCAL_STRATEGY_NAME = 'local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY_NAME) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  async validate(account: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(account, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.hashedPwd;
    return user;
  }
}
