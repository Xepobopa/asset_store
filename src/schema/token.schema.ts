import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ versionKey: false })
export class Token {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: false, type: String })
  refresh_token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);