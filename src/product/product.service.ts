import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, productDocument } from './schema/product.schema';
import { generateRandomString } from 'src/helpers/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserDetails } from 'src/user/interfaces/userDetails.interface';
import * as mongoService from '../helpers/mongoService/mongoService';
import { MaterialFromProductDto } from './dto/material-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    request,
  ): Promise<productDocument> {
    createProductDto['uid'] = await generateRandomString(
      'pro',
      this.productModel,
      { user: request.user._id },
    );
    createProductDto['user'] = request.user._id;

    return await mongoService.create(this.productModel, createProductDto);
  }

  async findAll(request, search, skipActive = false) {
    let filter = {};
    if (!skipActive) filter['active'] = true;
    filter['user'] = request.user._id;
    if (search) {
      filter = {
        ...filter,
        $or: [
          { productName: { $regex: `${search}`, $options: 'i' } },
          { productCode: { $regex: `${search}`, $options: 'i' } },
          { uid: { $regex: `${search}`, $options: 'i' } },
        ],
      };
    }

    return await mongoService.find(this.productModel, filter);
  }

  async findOne(id: ObjectId, request) {
    return await mongoService.findOne(this.productModel, {
      user: request.user._id,
      _id: id,
    });
  }

  async update(id: ObjectId, updateProductDto: UpdateProductDto, request) {
    return await mongoService.update(
      this.productModel,
      { user: request.user._id, _id: id },
      { ...updateProductDto },
    );
  }

  async remove(id: ObjectId, request) {
    return await mongoService.findOneAndSoftDelete(this.productModel, {
      user: request.user._id,
      _id: id,
    });
  }

  async materialFromProduct(
    materialFromProduct: MaterialFromProductDto,
    id: ObjectId,
    request,
  ) {
    let product = await mongoService.findOne(
      this.productModel,
      { user: request.user._id, _id: id },
      {},
      'material.material',
    );

    return await product.material.map((pro) => {
      return { mat: pro.material, qty: +pro.qty * +materialFromProduct['qty'] };
    });
  }
}
