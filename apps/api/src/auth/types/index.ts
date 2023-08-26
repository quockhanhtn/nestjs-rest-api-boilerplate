import { RoleEnum } from '@libs/infrastructures';

export type JwtAccessPayload = {
  sub: string;
  role: RoleEnum;
};

export type JwtRefreshPayload = {
  sub: string;
  sessionId: string;
  refreshToken: string;
};
