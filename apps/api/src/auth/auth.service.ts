import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RequestInfoData } from '@libs/core/request';
import { ConfigService, MongodbService } from '@libs/infrastructures';
import { RoleEnum, UserDocument } from '@libs/infrastructures/mongodb';

import { UsersService } from '../users/users.service';
import { TokenPair } from './';
import { AuthOutputDto, RegisterInputDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: MongodbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async register(input: RegisterInputDto): Promise<TokenPair> {
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
    const newUser = await this.dbService.users.create({
      ...input,
      hashedPwd: hashedPassword,
    });
    const token = await this._generateToken(newUser.id, newUser.role);

    return token;
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

    const token = await this._generateToken(user.id, user.role);

    await this.dbService.userSessions.create({
      user: user,
      refreshToken: token.refreshToken,
    });

    return {
      user: {
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      tokenPair: token,
    };
  }

  async logout(userId: string) {
    await this.dbService.users.updateMany(
      {
        _id: userId,
        hashedRt: {
          not: null,
        },
      },
      {
        hashedRt: null,
      },
    );
    return true;
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokenPair> {
    const user = await this.dbService.users.findOneById(userId);

    if (!user) {
      throw new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }

    // const isMatch = await bcrypt.compare(refreshToken, user.hashedRt);
    // if (!isMatch) {
    //   throw new HttpException('Refresh Token incorrect !', HttpStatus.UNAUTHORIZED);
    // }

    const token = await this._generateToken(user.id, user.role);

    return token;
  }

  private _hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private async _generateAccessToken(payload: Buffer | object): Promise<string> {
    const at = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.atSecret,
      expiresIn: this.configService.jwt.rtExpired,
    });
    return at;
  }

  private async _generateRefreshToken(payload: Buffer | object): Promise<string> {
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwt.rtSecret,
      expiresIn: this.configService.jwt.rtExpired,
    });
    return rt;
  }

  private async _generateToken(userId: string, role: RoleEnum): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: this.configService.jwt.atSecret,
          expiresIn: this.configService.jwt.rtExpired,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: this.configService.jwt.rtSecret,
          expiresIn: this.configService.jwt.rtExpired,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
