import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
const mongoService = require('../helpers/mongoService/mongoService')
@Injectable()
export class MaterialService {

  create(createMaterialDto: CreateMaterialDto) {
    mongoService.create("sada", "SAdas")
    return `This action adds a new material, ${CreateMaterialDto}`;
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
