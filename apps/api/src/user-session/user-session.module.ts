import { Module } from '@nestjs/common';

import { UserSessionService } from './user-session.service';

@Module({
  providers: [UserSessionService],
})
export class UserSessionModule {}
