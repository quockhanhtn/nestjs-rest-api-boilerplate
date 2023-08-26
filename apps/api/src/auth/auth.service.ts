import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { RequestInfoData } from '@libs/core/request';
import { ConfigService, RoleEnum, type UserEntity } from '@libs/infrastructures';

import { UserSessionsService } from '@api/user-sessions/user-sessions.service';
import { UsersService } from '@api/users/users.service';

import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: UserSessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(account: string, password: string): Promise<UserEntity> {
    let user: UserEntity;
    if (account.includes('@')) {
      // login with email
      user = await this.usersService.findUserByEmail(account);
    } else if (account.includes('+')) {
      // login with phone number
      user = await this.usersService.findUserByPhoneNumber(account);
    }

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPwd);
    if (!isCorrectPassword) {
      throw new BadRequestException('Wrong credentials!');
    }

    return user;
  }

  async signIn(user: UserEntity, reqInfo: RequestInfoData) {
    const sessionId = uuidV4(); // use for rotate fresh token

    const [accessToken, refreshToken] = await Promise.all([
      this._generateAccessToken(user._id, user.role),
      this._generateRefreshToken(user._id, sessionId),
    ]);

    await this.sessionsService.createSession(user._id, sessionId, refreshToken, reqInfo);

    return {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      tokenPair: { accessToken, refreshToken },
    };
  }

  async refreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
    reqInfo: RequestInfoData,
  ) {
    const isValid = await this.sessionsService.validateSession(sessionId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    await this.sessionsService.clearPrevSession(sessionId);

    const role = await this.usersService.getUserRole(userId);
    if (!role) {
      throw new UnauthorizedException();
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this._generateAccessToken(userId, role),
      this._generateRefreshToken(userId, sessionId),
    ]);

    await this.sessionsService.createSession(userId, sessionId, newRefreshToken, reqInfo);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async signUp(input: SignUpDto) {
    if (input.email) {
      const isExistingEmail = await this.usersService.isExistingEmail(input.email);
      if (isExistingEmail) {
        throw new ConflictException('Email already taken');
      }
    }
    if (input.phoneNumber) {
      const isExistingPhone = await this.usersService.isExistingPhoneNumber(input.phoneNumber);
      if (isExistingPhone) {
        throw new ConflictException('Phone number already taken');
      }
    }

    const hashedPassword = await this._hashData(input.password);
    const user = await this.usersService.create({ ...input, hashedPassword });
    return user;
  }

  private _hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private async _generateAccessToken(userId: string, role: RoleEnum): Promise<string> {
    const payload = { sub: userId, role: role };
    const at = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.accessToken.secret,
      expiresIn: this.configService.jwt.accessToken.expirationTime,
    });
    return at;
  }

  private async _generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload = { sub: userId, sessionId };
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.refreshToken.secret,
      expiresIn: this.configService.jwt.refreshToken.expirationTime,
    });
    return rt;
  }
}
