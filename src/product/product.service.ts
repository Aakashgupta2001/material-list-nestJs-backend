import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  Product,
  productDocument,
  ProductSchema,
} from './schema/product.schema';
import { generateRandomString } from 'src/helpers/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserDetails } from 'src/user/interfaces/userDetails.interface';
const mongoService = require('../helpers/mongoService/mongoService');
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<productDocument> {
    const { user } = createProductDto;
    createProductDto['uid'] = await generateRandomString(
      'pro',
      this.productModel,
      { user },
    );

    return await mongoService.create(this.productModel, createProductDto);
  }

  async findAll(request) {
    return await mongoService.find(this.productModel, {
      user: request.user.id,
    });
  }

  async findOne(id: ObjectId, request) {
    return await mongoService.findOne(this.productModel, {
      user: request.user.id,
      _id: id,
    });
  }

  async update(id: ObjectId, updateProductDto: UpdateProductDto, request) {
    return await mongoService.update(
      this.productModel,
      { user: request.user.id, _id: id },
      { ...updateProductDto },
    );
  }

  async remove(id: ObjectId, request) {
    return await mongoService.findOneAndHardDelete(this.productModel, {
      user: request.user.id,
      _id: id,
    });
  }
}
