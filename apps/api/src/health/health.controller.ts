import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequestInfo, RequestInfoData } from '@libs/core/request';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck(@RequestInfo() refInfo: RequestInfoData) {
    return {
      status: 'ok',
      requestInfo: refInfo,
    };
  }
}
