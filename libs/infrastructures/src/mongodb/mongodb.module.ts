import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@libs/infrastructures';

import { UserEntity, UserSchema, UserSessionEntity, UserSessionSchema } from './entities';
import { MongodbService } from './mongodb.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.db.mongoUri,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
      {
        name: UserSessionEntity.name,
        schema: UserSessionSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: MongodbService,
      useClass: MongodbService,
    },
  ],
  exports: [MongodbService],
})
export class MongodbModule {}
