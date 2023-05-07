import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { UsersModule } from "./user/users.module";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";
import { AssetModule } from "./asset/asset.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TokenModule,
    AssetModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SECRET_ACCESS: Joi.string().required(),
        SECRET_REFRESH: Joi.string().required(),
        DB_CONNECTION_STRING: Joi.string().required(),
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("DB_CONNECTION_STRING")
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {
}
