import { Injectable } from '@nestjs/common';

import { MongodbService } from '@libs/infrastructures';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: MongodbService) {}

  async isExistingEmail(email: string): Promise<boolean> {
    const valueToCheck = email.trim().toLocaleLowerCase();
    const isExisted = await this.dbService.users.exists(
      { email: valueToCheck },
      { withDeleted: true },
    );
    return isExisted;
  }

  async isExistingPhoneNumber(phoneNumber: string): Promise<boolean> {
    const valueToCheck = phoneNumber.trim();
    const isExisted = await this.dbService.users.exists(
      { phoneNumber: valueToCheck },
      { withDeleted: true },
    );
    return isExisted;
  }

  async findUserByEmail(email: string) {
    const valueToCheck = email.trim().toLocaleLowerCase();
    const user = await this.dbService.users.findOne({ email: valueToCheck });
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    const valueToCheck = phoneNumber.trim();
    const user = await this.dbService.users.findOne({ phoneNumber: valueToCheck });
    return user;
  }
}
