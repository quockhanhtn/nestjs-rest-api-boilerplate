import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserDocument } from '@libs/infrastructures';

import { UsersService } from '@api/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(account: string, password: string) {
    let user: UserDocument;
    if (account.includes('@')) {
      // login with email
      user = await this.usersService.findUserByEmail(account);
    } else if (account.includes('+')) {
      // login with phone number
      user = await this.usersService.findUserByPhoneNumber(account);
    }

    if (!user) {
      return null;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPwd);
    if (!isCorrectPassword) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    console.log(`[AuthService] login: user=${JSON.stringify(user)}`);
    const payload = { email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    };
  }
}
