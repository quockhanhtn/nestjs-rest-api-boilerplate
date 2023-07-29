import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetRequestMetadata, RequestMetadata } from '@libs/core/request';

import { Public } from '../auth';

@Public()
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck(@GetRequestMetadata() meta: RequestMetadata) {
    return {
      status: 'ok',
      meta: meta,
    };
  }
}
