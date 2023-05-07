import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Picture } from "../files/picture.type";

export type AssetDocument = HydratedDocument<Asset>;

@Schema({ versionKey: false })
export class Asset {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  desc: string;

  @Prop({ type: Number })
  price: number

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({
   type: [{
     buffer: {type: Buffer}, mimetype: {type: String}, size: {type: Number}
   }]
  })
  pictures: Picture[]
}

export const AssetSchema = SchemaFactory.createForClass(Asset);