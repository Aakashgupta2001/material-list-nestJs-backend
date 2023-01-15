import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { ObjectId } from 'mongoose';
import { Request } from 'express';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  create(
    @Body() createMaterialDto: CreateMaterialDto,
    @Req() request: Request,
  ) {
    return this.materialService.create(createMaterialDto, request);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.materialService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId, @Req() request: Request) {
    return this.materialService.findOne(id, request);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @Req() request: Request,
  ) {
    return this.materialService.update(id, updateMaterialDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
