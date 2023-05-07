import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Picture } from "../files/picture.type";

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

  @Prop({
    type: {
      buffer: {type: Buffer}, mimetype: {type: String}, size: {type: Number}
    }
  })
  avatar: Picture
}

export const UserSchema = SchemaFactory.createForClass(User);
