import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Asset, AssetSchema } from "../schema/asset.schema";
import { AssetService } from "./asset.service";
import { AssetController } from "./asset.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }])
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}