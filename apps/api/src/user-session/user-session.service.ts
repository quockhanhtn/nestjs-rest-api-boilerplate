import { Injectable } from '@nestjs/common';

import { RequestInfoData } from '@libs/core/request';
import { MongodbService } from '@libs/infrastructures';

@Injectable()
export class UserSessionService {
  constructor(private readonly dbService: MongodbService) {}

  async createSession(
    userId: string,
    sessionId: string,
    hashedRt: string,
    reqInfo: RequestInfoData,
  ) {
    const us = await this.dbService.userSessionsRepo.create({
      user: userId,
      sessionId: sessionId,
      hashedRefreshToken: hashedRt,
      metaData: reqInfo,
    });
    return us;
  }

  async findBySessionId(sessionId: string) {
    console.log('sessionId::', sessionId);
    const sessions = await this.dbService.userSessionsRepo.findAll(
      { sessionId: sessionId },
      { lean: true },
    );
    console.log('sessionId::', sessions);
    return sessions;
  }

  async clearPrevSession(sessionId: string) {
    const isSuccess = await this.dbService.userSessionsRepo.deleteMany({
      sessionId: sessionId,
    });
    return isSuccess;
  }
}
