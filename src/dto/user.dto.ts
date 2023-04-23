import { CreateUserDto } from "./create-user.dto";
import { IsBoolean, IsString } from "class-validator";

export class UserDto extends CreateUserDto {
  @IsBoolean()
  isActivated: boolean;

  @IsString()
  userId: string;

  @IsString()
  tokenId: string;
}