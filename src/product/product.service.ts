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
import { Model } from 'mongoose';
const mongoService = require('../helpers/mongoService/mongoService');

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<productDocument> {
    const { productCode, productName, material, user, active } =
      createProductDto;
    createProductDto['uid'] = await generateRandomString(
      'pro',
      this.productModel,
      { user },
    );

    return await mongoService.create(this.productModel, createProductDto);
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
