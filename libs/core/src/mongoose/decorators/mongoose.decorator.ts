import { InjectConnection, InjectModel, Schema, SchemaOptions } from '@nestjs/mongoose';

import { DATABASE_CONNECTION_NAME } from '@libs/core/mongoose/constants';

export function MongooseConnection(connectionName?: string): ParameterDecorator {
  return InjectConnection(connectionName ?? DATABASE_CONNECTION_NAME);
}

export function MongooseModel(entity: any, connectionName?: string): ParameterDecorator {
  return InjectModel(entity, connectionName ?? DATABASE_CONNECTION_NAME);
}

export function MongooseEntity(options?: SchemaOptions): ClassDecorator {
  return Schema({
    ...options,
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  });
}
