import { RoleEnum } from '@libs/infrastructures/mongodb';

export type JwtAccessPayloadData = {
  sub: string;
  role: RoleEnum;
};

export type JwtRefreshPayloadData = JwtAccessPayloadData & {
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
