import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Request, Response } from "express";
import { CreateUserDto } from "../dto/create-user.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = await this.authService.login(body);
        res.cookie('refreshToken', user.refreshToken, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        console.log(user.accessToken);
        res.json(user);
    }

    @Post('reg')
    @HttpCode(HttpStatus.CREATED)
    async writeUser(@Body() body: CreateUserDto, @Res() res: Response ) {
        const user = await this.authService.registration(body);

        return res.json({...user});
    }

    @Get('refresh')
    @HttpCode(HttpStatus.CREATED)
    async refresh(@Req() req: Request) {
        return await this.authService.refresh(this.authService.getRefreshToken(req));
    }

    @Get('activate/:activationLink')
    async activate(@Param('activationLink') activationLink: string, @Res() res: Response) {
        console.log(activationLink);
        await this.authService.activate(activationLink);
        res.redirect(HttpStatus.ACCEPTED, 'http:/localhost:5000/activated');
    }

    @Post('change/password')
    async changePassword(@Body() newPass: ChangePasswordDto, @Req() req: Request) {
        return await this.authService.changePassword(this.authService.getRefreshToken(req), newPass.password);
    }

    @Post('change/username')
    async changeUsername(@Body('username') newUsername: string, @Req() req: Request, @Res() res: Response) {
        const newUser =  await this.authService.changeUsername(
          this.authService.getRefreshToken(req),
          newUsername, res
        );
        res.json(newUser);
    }
}