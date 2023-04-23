import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, default: "" })
  activationLink: string;

  @Prop({ default: true, type: Boolean })
  isActivated: boolean;

  @Prop({ required: true, type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
