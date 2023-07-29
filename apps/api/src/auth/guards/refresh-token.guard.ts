import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RefreshTokenStrategyName } from '../strategies';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(RefreshTokenStrategyName) {
  constructor() {
    super();
  }
}
