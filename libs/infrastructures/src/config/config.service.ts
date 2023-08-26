import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { cleanEnv, num, port, str, url } from 'envalid';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly loadedEnv: ReturnType<typeof loadCleanEnv>;

  constructor() {
    this.logger.log('Loading config ...');
    this.loadedEnv = loadCleanEnv();
    this.logger.log('Loaded config !');
    if (this.app.isDevelopment) {
      this.logger.log('Config detail: \n' + JSON.stringify(this.loadedEnv, null, 2));
    }
  }

  get app() {
    return {
      env: this.loadedEnv.NODE_ENV,
      isDevelopment: this.loadedEnv.isDevelopment,
      isProduction: this.loadedEnv.isProduction,
      port: this.loadedEnv.PORT,
    };
  }

  get db() {
    return {
      mongoUri: this.loadedEnv.MONGO_DB_URI,
    };
  }

  get jwt() {
    return {
      accessToken: {
        secret: this.loadedEnv.JWT_ACCESS_TOKEN_SECRET,
        expirationTime: this.loadedEnv.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
      refreshToken: {
        secret: this.loadedEnv.JWT_REFRESH_TOKEN_SECRET,
        expirationTime: this.loadedEnv.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      },
    };
  }
}

const loadCleanEnv = () => {
  dotenv.config();

  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production', 'test'],
      default: 'development',
    }),
    PORT: port({ default: 9200 }),
    MONGO_DB_URI: url({
      desc: 'MongoDB connection uri',
      docs: 'https://www.mongodb.com/docs/manual/reference/connection-string/',
    }),

    JWT_ACCESS_TOKEN_SECRET: str(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: num({ default: 15 * 60 /* 15 minutes */ }),
    JWT_REFRESH_TOKEN_SECRET: str(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: num({ default: 30 * 60 * 60 * 24 /* 30 days */ }),
  });
};
