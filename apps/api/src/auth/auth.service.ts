import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { RequestInfoData } from '@libs/core/request';
import { ConfigService, MongodbService } from '@libs/infrastructures';
import { RoleEnum, UserDocument } from '@libs/infrastructures/mongodb';

import { UserSessionService } from '../user-session/user-session.service';
import { UserService } from '../user/user.service';
import {
  AccountNotFoundException,
  InvalidInputException,
  InvalidRefreshTokenException,
  JwtAccessPayloadData,
  JwtRefreshPayloadData,
  TokenPair,
} from './';
import { AuthOutputDto, RegisterInputDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: MongodbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly sessionService: UserSessionService,
  ) {}

  async register(input: RegisterInputDto, reqInfo: RequestInfoData): Promise<AuthOutputDto> {
    if (input.email) {
      const isExistingEmail = await this.userService.isExistingEmail(input.email);
      if (isExistingEmail) {
        throw new InvalidInputException('Email already taken');
      }
    }
    if (input.phoneNumber) {
      const isExistingPhone = await this.userService.isExistingPhoneNumber(input.phoneNumber);
      if (isExistingPhone) {
        throw new InvalidInputException('Phone number already taken');
      }
    }

    const hashedPassword = await this._hashData(input.password);
    const newUser = await this.dbService.usersRepo.create({
      ...input,
      hashedPwd: hashedPassword,
    });

    const rs = await this._authentication(newUser, reqInfo);
    return rs;
  }

  async login(account: string, password: string, reqInfo: RequestInfoData): Promise<AuthOutputDto> {
    let user: UserDocument;
    if (account.includes('@')) {
      // login with email
      user = await this.userService.findUserByEmail(account);
    } else if (account.includes('+')) {
      // login with phone number
      user = await this.userService.findUserByPhoneNumber(account);
    }

    if (!user) {
      throw new AccountNotFoundException();
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPwd);
    if (!isCorrectPassword) {
      throw new InvalidInputException('Password incorrect');
    }

    const rs = await this._authentication(user, reqInfo);
    return rs;
  }

  async logout(sessionId: string, refreshToken: string) {
    const isValid = await this.sessionService.validateSession(sessionId, refreshToken);
    if (!isValid) {
      throw new InvalidRefreshTokenException();
    }
    await this.sessionService.clearPrevSession(sessionId);
    return true;
  }

  async refreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
    reqInfo: RequestInfoData,
  ): Promise<TokenPair> {
    const isValid = await this.sessionService.validateSession(sessionId, refreshToken);
    if (!isValid) {
      throw new InvalidRefreshTokenException();
    }
    await this.sessionService.clearPrevSession(sessionId);

    const role = await this.userService.getUserRole(userId);
    if (!role) {
      throw new AccountNotFoundException();
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this._generateAccessToken(userId, role),
      this._generateRefreshToken(userId, sessionId),
    ]);

    await this.sessionService.createSession(userId, sessionId, newRefreshToken, reqInfo);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async _authentication(
    user: UserDocument,
    reqInfo: RequestInfoData,
  ): Promise<AuthOutputDto> {
    const sessionId = uuidV4(); // use for rotate fresh token

    const [accessToken, refreshToken] = await Promise.all([
      this._generateAccessToken(user._id, user.role),
      this._generateRefreshToken(user._id, sessionId),
    ]);

    await this.sessionService.createSession(user._id, sessionId, refreshToken, reqInfo);

    return {
      user: {
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      tokenPair: { accessToken, refreshToken },
    };
  }

  private _hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private async _generateAccessToken(userId: string, role: RoleEnum): Promise<string> {
    const payload: JwtAccessPayloadData = { sub: userId, role: role };
    const at = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.atSecret,
      expiresIn: this.configService.jwt.rtExpired,
    });
    return at;
  }

  private async _generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload: Omit<JwtRefreshPayloadData, 'refreshToken'> = { sub: userId, sessionId };
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.rtSecret,
      expiresIn: this.configService.jwt.rtExpired,
    });
    return rt;
  }
}
