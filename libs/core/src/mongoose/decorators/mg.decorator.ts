import { InjectConnection, InjectModel, Schema, SchemaOptions } from '@nestjs/mongoose';

import { MG_CONNECTION_NAME } from '@libs/core/mongoose/constants';

export function MgConnection(connectionName?: string): ParameterDecorator {
  return InjectConnection(connectionName ?? MG_CONNECTION_NAME);
}

export function MgModel(entity: any, connectionName?: string): ParameterDecorator {
  return InjectModel(entity, connectionName ?? MG_CONNECTION_NAME);
}

export function MgEntity(options?: SchemaOptions): ClassDecorator {
  return Schema({
    ...options,
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  });
}
