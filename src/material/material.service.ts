import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, ObjectId } from 'mongoose';

import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialDocument, Material } from './schema/material.schema';
import { generateRandomString } from '../helpers/helpers';
import * as mongoService from '../helpers/mongoService/mongoService';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto, req) {
    console.log(req.user);
    createMaterialDto['uid'] = await generateRandomString(
      'Mat',
      this.materialModel,
      { user: req.user._id },
    );
    createMaterialDto['user'] = req.user._id;
    return await mongoService.create(this.materialModel, createMaterialDto);
  }

  async findAll(req, search, type) {
    let filter = {};
    filter['active'] = true;
    filter['user'] = req.user._id;
    console.log('filter', req.user);
    if (type) filter['materialType'] = type;
    if (search) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: `${search}`, $options: 'i' } },
          { uid: { $regex: search, $options: 'i' } },
          { matCode: { $regex: search, $options: 'i' } },
          { rackNo: { $regex: search, $options: 'i' } },
        ],
      };
    }
    console.log(filter);
    return await mongoService.find(this.materialModel, filter);
  }

  async findOne(id: ObjectId, req) {
    return await mongoService.findOne(this.materialModel, {
      user: req.user._id,
      _id: id,
    });
  }

  async update(id: ObjectId, updateMaterialDto: UpdateMaterialDto, req) {
    return await mongoService.update(
      this.materialModel,
      { user: req.user._id, _id: id },
      {
        ...updateMaterialDto,
      },
    );
  }

  async remove(id: ObjectId, req) {
    return await mongoService.findOneAndSoftDelete(this.materialModel, {
      user: req.user._id,
      _id: id,
    });
  }
}
