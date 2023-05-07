import { Prop } from "@nestjs/mongoose";
import { IsMongoId, IsString } from "class-validator";

export class CreateAssetDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  price: number;

  @IsMongoId()
  userId: string;
}