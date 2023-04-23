import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotExistException extends HttpException {
  constructor(description?: string) {
    super('User does\'t exist in database!', HttpStatus.BAD_REQUEST, {description});
  }
}