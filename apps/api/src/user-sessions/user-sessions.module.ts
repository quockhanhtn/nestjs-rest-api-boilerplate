import { Module } from '@nestjs/common';

import { UserSessionsService } from './user-sessions.service';

@Module({
  providers: [UserSessionsService],
})
export class UserSessionsModule {}
