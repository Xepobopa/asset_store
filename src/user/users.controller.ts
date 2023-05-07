import {
    Controller,
    Get, HttpStatus,
    Param, ParseFilePipeBuilder,
    Post, UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {UsersService} from "./users.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('profiles')
    @UseGuards(JwtAuthGuard)
    async getProfiles() {
        return await this.userService.getAll();
    }

    @Post(':id/setAvatar')
    @UseInterceptors(FilesInterceptor('avatar'))
    async setAvatar(
      @Param("id") userId: string,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
              fileType: "image/jpeg"
          })
          .addMaxSizeValidator({
              maxSize: 1 * 1000 * 1000
          })
          .build({
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
          })
      ) avatar: Express.Multer.File) {
      return await this.userService.addAvatar(avatar, userId);
    }
}
