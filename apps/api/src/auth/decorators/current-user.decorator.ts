import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtAccessPayload } from '../types';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const payload = request.user as JwtAccessPayload;
  console.log('CurrentUser', payload);
  return payload;
});
