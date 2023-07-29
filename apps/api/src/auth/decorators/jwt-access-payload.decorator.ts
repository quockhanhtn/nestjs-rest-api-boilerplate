import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtAccessPayloadData } from '../types';

export const JwtAccessPayload = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as JwtAccessPayloadData;
    return payload;
  },
);
