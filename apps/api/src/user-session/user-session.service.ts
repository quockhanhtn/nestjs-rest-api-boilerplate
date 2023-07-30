import { Injectable } from '@nestjs/common';

import { RequestInfoData } from '@libs/core/request';
import { CryptoUtils } from '@libs/core/utils';
import { MongodbService } from '@libs/infrastructures';

@Injectable()
export class UserSessionService {
  constructor(private readonly dbService: MongodbService) {}

  async createSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    reqInfo: RequestInfoData,
  ) {
    const hashedRt = CryptoUtils.hashData(refreshToken);
    const us = await this.dbService.userSessionsRepo.create({
      user: userId,
      sessionId: sessionId,
      hashedRefreshToken: hashedRt,
      metaData: reqInfo,
    });
    return us;
  }

  async validateSession(sessionId: string, refreshToken: string) {
    const sessions = await this.dbService.userSessionsRepo.findAll(
      { sessionId: sessionId },
      {
        select: { hashedRefreshToken: 1 },
        lean: true,
      },
    );

    if (!sessions || sessions.length === 0 || sessions.length > 1) {
      if (sessions.length > 1) {
        await this.clearPrevSession(sessionId);
      }
      return false;
    }

    const currentSession = sessions[0];
    const isMatch = CryptoUtils.compareHash(refreshToken, currentSession.hashedRefreshToken);
    return isMatch;
  }

  async clearPrevSession(sessionId: string) {
    const isSuccess = await this.dbService.userSessionsRepo.deleteMany({
      sessionId: sessionId,
    });
    return isSuccess;
  }
}
