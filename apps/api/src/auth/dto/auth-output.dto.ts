import { ApiResponseProperty } from '@nestjs/swagger';

import { UserEntity } from '@libs/infrastructures/mongodb/entities';

import { TokenPair } from '../';

export class AuthOutputDto {
  @ApiResponseProperty()
  user: Pick<UserEntity, '_id' | 'name' | 'username' | 'email' | 'phoneNumber'>;

  @ApiResponseProperty()
  tokenPair: TokenPair;
}
