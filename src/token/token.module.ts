import { Module} from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Token, TokenSchema } from "../schema/token.schema";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}