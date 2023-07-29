import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtRefreshStrategyName } from '../strategies';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JwtRefreshStrategyName) {
  constructor() {
    super();
  }
}
