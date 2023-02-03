import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, orderDocument } from './schema/order.schema';
import { Model, mongo, ObjectId } from 'mongoose';
import { generateRandomString } from 'src/helpers/helpers';
import * as mongoService from '../helpers/mongoService/mongoService';
import { Product, productDocument } from 'src/product/schema/product.schema';
const util = require('util');

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<orderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, req) {
    createOrderDto['uid'] = await generateRandomString('Ord', this.orderModel, {
      user: req.user.id,
    });

    return await mongoService.create(this.orderModel, createOrderDto);
  }

  async findAll(req) {
    return await mongoService.find(this.orderModel, { user: req.user.id });
  }

  async findOne(id: ObjectId, req) {
    let products = await mongoService.findOne(this.orderModel, {
      user: req.user.id,
      _id: id,
    });
    let materials = await this.getMaterialListFromOrder(products.product);
    products['materials'] = materials;
    return await mongoService.findOne(this.orderModel, {
      user: req.user.id,
      _id: id,
    });
  }

  async getMaterialListFromOrder(productArray: CreateOrderDto['product']) {
    let query = [
      {
        //Extracting Products
        $lookup: {
          from: 'products',
          localField: 'product.product',
          foreignField: '_id',
          as: 'productDetails.products',
        },
      },
      {
        $unwind: {
          path: '$product.product',
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   //Extracting Materials
      //   $lookup: {
      //     from: 'materials',
      //     localField: 'productDetails.products.material.material',
      //     foreignField: '_id',
      //     as: 'materialDetails',
      //   },
      // },
    ];
    let ans = await mongoService.aggregate(this.orderModel, query);
    // console.log('PRODUCT_LIST = ', ans[0]);
    console.log(
      'PRODUCT_LIST = ',
      util.inspect(ans, false, null, true /* enable colors */),
    );
  }

  async update(id: ObjectId, updateOrderDto: UpdateOrderDto, req) {
    return await mongoService.update(
      this.orderModel,
      { user: req.user.id, _id: id },
      { ...updateOrderDto },
    );
  }

  async remove(id: ObjectId, req) {
    return await mongoService.findOneAndHardDelete(this.orderModel, {
      user: req.user.id,
      _id: id,
    });
  }
}
