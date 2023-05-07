import { Get, Injectable, UploadedFile, UseInterceptors } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Asset, AssetDocument } from "../schema/asset.schema";
import { CreateAssetDto } from "../dto/create-asset.dto";
import * as mongoose from "mongoose";

@Injectable()
export class AssetService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<AssetDocument>) {}

  async createAsset(pictures: Array<Express.Multer.File>, info: CreateAssetDto) {
    return await this.assetModel.create({ info, pictures, });
  }

  async getAssetsByUserId(id: string){
    return this.assetModel.find({ userId: new mongoose.Types.ObjectId(id) })
  }
}