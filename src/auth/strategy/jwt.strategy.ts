import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from "../../dto/user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("SECRET_ACCESS"),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: UserDto) {
        console.log(payload)
        if (!payload.isActivated) {
            throw new UnauthorizedException(`${payload.username}'s is not activated`);
        }
        return payload;
    }
}