import {BadRequestException, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
}
