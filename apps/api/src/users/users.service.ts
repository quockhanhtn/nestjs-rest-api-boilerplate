import { Injectable } from '@nestjs/common';

import { MongodbService, RoleEnum, UserEntity } from '@libs/infrastructures';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: MongodbService) {}

  async create(data: {
    hashedPassword: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    const newUser = await this.dbService.usersRepo.create({
      ...data,
    });
    return newUser;
  }

  async isExistingEmail(email: string): Promise<boolean> {
    const valueToCheck = email.trim().toLocaleLowerCase();
    const isExisted = await this.dbService.usersRepo.exists(
      { email: valueToCheck },
      { withDeleted: true },
    );
    return isExisted;
  }

  async isExistingPhoneNumber(phoneNumber: string): Promise<boolean> {
    const valueToCheck = phoneNumber.trim();
    const isExisted = await this.dbService.usersRepo.exists(
      { phoneNumber: valueToCheck },
      { withDeleted: true },
    );
    return isExisted;
  }

  async findUserByEmail(email: string) {
    const valueToCheck = email.trim().toLocaleLowerCase();
    const user = await this.dbService.usersRepo.findOne<UserEntity>({
      email: valueToCheck,
    });
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    const valueToCheck = phoneNumber.trim();
    const user = await this.dbService.usersRepo.findOne<UserEntity>({
      phoneNumber: valueToCheck,
    });
    return user;
  }

  async getUserRole(userId: string): Promise<RoleEnum | ''> {
    const user = await this.dbService.usersRepo.findOneById(userId, {
      select: { role: 1 },
      withDeleted: true,
      lean: true,
    });

    if (user) {
      return user.role;
    }

    return '';
  }
}
