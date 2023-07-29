import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getParser } from 'bowser';

import { RequestMetadata } from '../types';

export const GetRequestMetadata = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const ipAddress = req.connection.remoteAddress;
    const ua = req.headers['user-agent'] ?? 'Unknown/Unknown';

    const uaParser = getParser(ua);

    const metaData: RequestMetadata = {
      ipAddress,
      ua,
      browser: uaParser.getBrowser(),
      os: uaParser.getOS(),
      platform: uaParser.getPlatform(),
      engine: uaParser.getEngine(),
    };
    return metaData;
  },
);
