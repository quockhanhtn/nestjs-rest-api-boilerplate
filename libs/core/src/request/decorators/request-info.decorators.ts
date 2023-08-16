import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getParser } from 'bowser';

import { RequestInfoData } from '../types';

export const RequestInfo = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  const ipAddress = req.connection.remoteAddress;
  const ua = req.headers['users-agent'] ?? 'Unknown/Unknown';

  const uaParser = getParser(ua);

  const metaData: RequestInfoData = {
    ipAddress,
    ua,
    browser: uaParser.getBrowser(),
    os: uaParser.getOS(),
    platform: uaParser.getPlatform(),
    engine: uaParser.getEngine(),
  };
  return metaData;
});
