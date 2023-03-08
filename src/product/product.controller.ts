import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MaterialFromProductDto } from './dto/material-product.dto';
import { Query, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    return this.productService.create(createProductDto, request);
  }

  @Get()
  findAll(@Req() request: Request, @Query('search') search: ObjectId) {
    return this.productService.findAll(request, search);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId, @Req() request: Request) {
    return this.productService.findOne(id, request);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    return this.productService.update(id, updateProductDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId, @Req() request: Request) {
    return this.productService.remove(id, request);
  }

  @Post('material/:id')
  materialFromProduct(
    @Body() materialFromProduct: MaterialFromProductDto,
    @Param('id') id: ObjectId,
    @Req() request: Request,
  ) {
    return this.productService.materialFromProduct(
      materialFromProduct,
      id,
      request,
    );
  }
}
