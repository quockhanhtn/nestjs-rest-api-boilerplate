import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthPayload, AuthPayloadWithRefresh } from '../types';

export const GetAuthPayload = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const payload = request.user as AuthPayload;
  return payload;
});

export const GetAuthPayloadWithRefresh = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload = request.user as AuthPayloadWithRefresh;
    return payload;
  },
);
