import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, ObjectId } from 'mongoose';

import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialDocument, Material } from './schema/material.schema';
import { generateRandomString } from '../helpers/helpers';

const mongoService = require('../helpers/mongoService/mongoService');
@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto, request) {
    createMaterialDto['uid'] = await generateRandomString(
      'Mat',
      this.materialModel,
      { user: request.user.id },
    );
    createMaterialDto['user'] = request.user.id;
    return await mongoService.create(this.materialModel, createMaterialDto);
  }

  async findAll(req) {
    return await mongoService.find(this.materialModel, {
      user: req.user.id,
    });
  }

  async findOne(id: ObjectId, req) {
    return await mongoService.findOne(this.materialModel, {
      user: req.user.id,
      _id: id,
    });
  }

  async update(id: ObjectId, updateMaterialDto: UpdateMaterialDto, req) {
    return await mongoService.update(
      this.materialModel,
      { user: req.user.id, _id: id },
      {
        ...updateMaterialDto,
      },
    );
  }

  async remove(id: ObjectId, request) {
    return await mongoService.findOneAndHardDelete(this.materialModel, {
      user: request.user.id,
      _id: id,
    });
  }
}
