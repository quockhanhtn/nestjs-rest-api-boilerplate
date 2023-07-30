import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { RequestInfoData } from '@libs/core/request';
import { ConfigService, MongodbService } from '@libs/infrastructures';
import { RoleEnum, UserDocument } from '@libs/infrastructures/mongodb';

import { UserSessionService } from '../user-session/user-session.service';
import { UserService } from '../user/user.service';
import { JwtAccessPayloadData, JwtRefreshPayloadData, TokenPair } from './';
import { AuthOutputDto, RegisterInputDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: MongodbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async register(input: RegisterInputDto, reqInfo: RequestInfoData): Promise<AuthOutputDto> {
    if (input.email) {
      const isExistingEmail = await this.userService.isExistingEmail(input.email);
      if (isExistingEmail) {
        throw new HttpException('Email already taken', HttpStatus.BAD_REQUEST);
      }
    }
    if (input.phoneNumber) {
      const isExistingPhone = await this.userService.isExistingPhoneNumber(input.phoneNumber);
      if (isExistingPhone) {
        throw new HttpException('Phone number already taken', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPwd);
    if (!isCorrectPassword) {
      throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
    }

    const rs = await this._authentication(user, reqInfo);
    return rs;
  }

  async logout(sessionId: string, refreshToken: string) {
    await this._validateRefreshToken(sessionId, refreshToken);
    const rs = await this.userSessionService.clearPrevSession(sessionId);
    return rs;
  }

  async refreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
    reqInfo: RequestInfoData,
  ): Promise<TokenPair> {
    await this._validateRefreshToken(sessionId, refreshToken);

    const role = await this.userService.getUserRole(userId);
    if (!role) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this._generateAccessToken(userId, role),
      this._generateRefreshToken(userId, sessionId),
    ]);

    const hashedRt = await this._hashData(newRefreshToken);

    await this.userSessionService.clearPrevSession(sessionId);
    await this.userSessionService.createSession(userId, sessionId, hashedRt, reqInfo);

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

    const hashedRt = await this._hashData(refreshToken);
    await this.userSessionService.createSession(user._id, sessionId, hashedRt, reqInfo);

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

  private async _validateRefreshToken(sessionId: string, refreshToken: string) {
    const sessions = await this.userSessionService.findBySessionId(sessionId);
    if (!sessions || sessions.length === 0 || sessions.length > 1) {
      if (sessions.length > 1) {
        await this.userSessionService.clearPrevSession(sessionId);
      }
      throw new HttpException('Refresh Token Invalid', HttpStatus.UNAUTHORIZED);
    }
    const currentSession = sessions[0];
    const isMatch = await bcrypt.compare(refreshToken, currentSession.hashedRefreshToken);
    if (!isMatch) {
      await this.userSessionService.clearPrevSession(sessionId);
      throw new HttpException('Refresh Token Invalid', HttpStatus.UNAUTHORIZED);
    }
    return true;
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
