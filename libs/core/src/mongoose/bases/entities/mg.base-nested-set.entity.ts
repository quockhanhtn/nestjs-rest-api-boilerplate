import { Prop } from '@nestjs/mongoose';

import { MgBaseEntity } from './mg.base.entity';

export abstract class MgBaseNestedSetEntity extends MgBaseEntity {
  @Prop({ type: Number, required: true })
  left: number;

  @Prop({ type: Number, required: true })
  right: number;
}
