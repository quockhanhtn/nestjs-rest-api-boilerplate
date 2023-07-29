import { Test } from '@nestjs/testing';

import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    process.env = {
      NODE_ENV: 'development',
      PORT: '9200',
      MONGO_DB_URI: 'mongodb://localhost:27017/mydb',
      AUTH_JWT_ACCESS_TOKEN_SECRET: 'access-token-secret',
      AUTH_JWT_ACCESS_TOKEN_EXPIRED: '15m',
      AUTH_JWT_REFRESH_TOKEN_SECRET: 'refresh-token-secret',
      AUTH_JWT_REFRESH_TOKEN_EXPIRED: '30d',
    };

    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('should have correct values for app properties', () => {
    expect(configService.app.isDevelopment).toBe(true);
    expect(configService.app.isProduction).toBe(false);
    expect(configService.app.port).toBe(9200);
  });

  it('should have correct values for db properties', () => {
    expect(configService.db.mongoUri).toBe('mongodb://localhost:27017/mydb');
  });

  it('should have correct values for jwt properties', () => {
    expect(configService.jwt.atSecret).toBe('access-token-secret');
    expect(configService.jwt.atExpired).toBe('15m');
    expect(configService.jwt.rtSecret).toBe('refresh-token-secret');
    expect(configService.jwt.rtExpired).toBe('30d');
  });
});
