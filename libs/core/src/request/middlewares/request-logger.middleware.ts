import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip: ipRaw } = req;
    const ip = this.getFormattedIp(ipRaw);
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(`[${ip} ${userAgent}] --> ${method} ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const endTime = Date.now();
      const duration = endTime - startTime;

      this.logger.log(
        `[${ip} ${userAgent}] <-- ${method} ${originalUrl} • Status: ${statusCode}, Time: ${duration}ms, Sizes: ${contentLength}B`,
      );
    });

    next();
  }

  private getFormattedIp(ip: string): string {
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    return ip;
  }
}
