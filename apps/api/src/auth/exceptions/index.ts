import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotFoundException extends HttpException {
  constructor() {
    super('Account not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidInputException extends HttpException {
  constructor(mgs: string) {
    super(mgs, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}
