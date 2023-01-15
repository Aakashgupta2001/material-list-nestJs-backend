import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialDocument, Material } from './schema/material.schema';
const mongoService = require('../helpers/mongoService/mongoService')
import {generateRandomString} from "../helpers/helpers"
@Injectable()
export class MaterialService {

  constructor(@InjectModel(Material.name) private materialModel: Model<MaterialDocument>) {}

  async create(createMaterialDto: CreateMaterialDto) {
    createMaterialDto["uid"] = await generateRandomString("Mat", this.materialModel, {user: createMaterialDto.user})
    return await mongoService.create(this.materialModel, createMaterialDto);
  }

  findAll() {
    return `This action returns all material`;
  }

  findOne(id: number) {
    return `This action returns a #${id} material`;
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
}
