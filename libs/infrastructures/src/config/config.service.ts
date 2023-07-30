import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { cleanEnv, port, str, url } from 'envalid';

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
      atSecret: this.loadedEnv.AUTH_JWT_ACCESS_TOKEN_SECRET,
      atExpired: this.loadedEnv.AUTH_JWT_ACCESS_TOKEN_EXPIRED,

      rtSecret: this.loadedEnv.AUTH_JWT_REFRESH_TOKEN_SECRET,
      rtExpired: this.loadedEnv.AUTH_JWT_REFRESH_TOKEN_EXPIRED,
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

    AUTH_JWT_ACCESS_TOKEN_SECRET: str({ default: 'access-token-secret' }),
    AUTH_JWT_ACCESS_TOKEN_EXPIRED: str({ default: '15m' }),

    AUTH_JWT_REFRESH_TOKEN_SECRET: str({ default: 'fresh-token-secret' }),
    AUTH_JWT_REFRESH_TOKEN_EXPIRED: str({ default: '30d' }),
  });
};
