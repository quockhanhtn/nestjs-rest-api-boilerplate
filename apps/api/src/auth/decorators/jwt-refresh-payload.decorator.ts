import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtRefreshPayloadData } from '../types';

export const JwtRefreshPayload = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as JwtRefreshPayloadData;
    return payload;
  },
);
