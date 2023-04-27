import {BadRequestException, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../user/users.service";
import { TokenDocument } from "../schema/token.schema";
import { UserDocument } from "../schema/user.schema";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
    ) {
    }

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async refresh(token: string) {
        if (!token) {
            throw new BadRequestException('refreshToken is not valid');
        }

        const decoded = await this.tokenService.verifyRefreshToken(token);
        const tokenFromDb: TokenDocument = await this.tokenService.findToken(token);
        if (!decoded || !tokenFromDb) {
            throw new BadRequestException('refreshToken is not valid');
        }

        const payload = (await this.userService.findOneById(tokenFromDb.userId)).toObject();
        console.log(payload);
        return this.tokenService.generateToken(payload).accessToken;
    }

    async activate(activationLink: string) {
        const user = await this.userService.activate(activationLink);
        user.isActivated = true;
        await user.save();
    }

    async login(userData: CreateUserDto) {
        const user: UserDocument = await this.userService.login(userData);
        const tokens = this.tokenService.generateToken(user.toObject());
        await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);

        return {...tokens, user};
    }

    async registration(userData: CreateUserDto) {
        const user: UserDocument = await this.userService.writeUser(userData);

        return {user};
    }

    async changePassword(refreshToken: string, newPass: string) {
        const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
        const user: UserDocument = await this.userService.findOneById(decoded._id);
        user.password = await bcrypt.hash(newPass, 5);
        return await user.save();
    }

    async changeUsername(refreshToken: string, newUsername: string, res: Response) {
        const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
        const user: UserDocument = await this.userService.findOneById(decoded._id);
        user.username = newUsername;
        await user.save();

        const newTokenPayload = this.tokenService.generateToken(user.toObject());
        res.cookie('refreshToken', newTokenPayload, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return user;
    }

    getRefreshToken(req: Request) {
        let refreshToken;
        if (req && req.cookies) {
            refreshToken = req.cookies['refreshToken'];
        }
        return refreshToken;
    }
}
