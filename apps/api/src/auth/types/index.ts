import { RoleEnum } from '@libs/infrastructures/mongodb';

export type JwtAccessPayloadData = {
  sub: string;
  role: RoleEnum;
};

export type JwtRefreshPayloadData = {
  sub: string;
  sessionId: string;
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
