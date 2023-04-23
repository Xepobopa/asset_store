import { Controller, Get, UseGuards } from "@nestjs/common";
import {UsersService} from "./users.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('profiles')
    @UseGuards(JwtAuthGuard)
    async getProfiles() {
        return await this.userService.getAll();
    }
}
