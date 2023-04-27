import { CreateUserDto } from "./create-user.dto";
import { IsBoolean, IsString } from "class-validator";
import * as mongoose from "mongoose";

export class UserDto extends CreateUserDto {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  activationLink: string;
  isActivated: boolean;
  password: string;
}