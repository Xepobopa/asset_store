import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as uuid from 'uuid';
import { User, UserDocument } from "../schema/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserNotExistException } from "../exception/user.exception";
import * as mongoose from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    async findOne(username: string) {
        return this.userModel.findOne({username}).orFail(new UserNotExistException(`Can't find user with name: ${username}`));
    }

    async getAll() {
        return this.userModel.find();
    }

    async activate(activationLink: string) {
        return this.userModel.findOne({activationLink})
          .orFail(new UserNotExistException("Can't find user by activation link"));
    }

    async findOneById(id: string) {
        return this.userModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).orFail(new Error(`Can't find user by id: ${id}`));
    }

    async login(userData: CreateUserDto) {
        const user = await this.userModel.findOne({ username: userData.username, email: userData.email })
          .orFail(new UserNotExistException(`Can't find user by userData: '${userData.username}', '${userData.email}'`));
        if (!await bcrypt.compare(userData.password, user.password)) {
            throw new BadRequestException('Password is wrong')
        }

        //await this.mailService.sendMail(user.email, user.activationLink);
        return user;
    }

    async writeUser(user: CreateUserDto): Promise<UserDocument> {
        const activationLink = uuid.v4();
        return await this.userModel.create({
            username: user.username,
            email: user.email,
            activationLink,
            isActivated: true,
            password: await bcrypt.hash(user.password, 5),
        } as User);
    }

    async addAvatar(avatar: Express.Multer.File, id: string) {
        const user = await this.userModel.findById(id);
        user.avatar = avatar;
        return user.save();
    }
}
