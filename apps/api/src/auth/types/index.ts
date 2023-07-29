import { Role } from '@libs/infrastructures/roles';

export type AuthPayload = {
  sub: string;
  roles: Role[];
};

export type AuthPayloadWithRefresh = AuthPayload & {
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
