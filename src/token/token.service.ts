import { BadRequestException, Injectable } from "@nestjs/common";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {JwtService} from '@nestjs/jwt';
import * as mongoose from 'mongoose';
import { Token, TokenDocument } from "../schema/token.schema";
import { ConfigService } from "@nestjs/config";
import { UserDto } from "../dto/user.dto";

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }

    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token, {secret: this.configService.get<string>('SECRET_REFRESH'), ignoreExpiration: false });
        } catch (e) {
            return null;
        }
    }

    async findToken(token: string) {
        return this.tokenModel.findOne({ refresh_token: token });
    }

    generateToken(payload: Partial<UserDto>) {
        const temp_payload = {
            _id: payload._id.toString(),
            username: payload.username,
            email: payload.email,
            isActivated: payload.isActivated
        }
        const accessToken = this.jwtService.sign(temp_payload, {
            expiresIn: '5m',
            secret: this.configService.get<string>("SECRET_ACCESS"),
            algorithm: 'HS256',
        });
        const refreshToken = this.jwtService.sign(temp_payload, {
            expiresIn: '20d',
            secret: this.configService.get<string>("SECRET_REFRESH"),
            algorithm: 'HS256',
        });

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: mongoose.Types.ObjectId, refresh_token: string ) {
        const token = await this.tokenModel.findOne({userId});
        console.log(token);
        if (token) {
            token.refresh_token = refresh_token;
            return token.save();
        }
        return await this.tokenModel.create({refresh_token, userId});
    }
}
