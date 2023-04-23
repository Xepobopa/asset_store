import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsStrongPassword({
      minLength: 6,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1
    },
    {
      message: "Password is too simple. Minimal length is 6 characters, it must contain at least 1 number, 1 uppercase, 1 lowercase, 1 symbol"
    }
  )
  password: string;

  @IsEmail({}, { message: "Email is wrong" })
  email: string;

  @IsString()
  username: string;
}