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
    createOrderDto['user'] = req.user.id;

    return await mongoService.create(this.orderModel, createOrderDto);
  }

  async findAll(request, search) {
    let filter = {};
    filter['user'] = request.user.id;
    if (search) {
      filter = {
        ...filter,
        $or: [
          { uid: { $regex: `${search}`, $options: 'i' } },
          { companyName: { $regex: `${search}`, $options: 'i' } },
          { workOrderNo: { $regex: `${search}`, $options: 'i' } },
        ],
      };
    }
    return await mongoService.find(this.orderModel, filter);
  }

  async findOne(id: ObjectId, req) {
    let products = await mongoService.findOne(this.orderModel, {
      user: req.user.id,
      _id: id,
    });
    let materials = await this.getMaterialListFromOrder(id, req.user.id);

    return await materials;
  }

  async getMaterialListFromOrder(id: ObjectId, user: ObjectId) {
    console.log(id);
    let query = [
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: id }] },
        },
      },
      {
        $match: {
          $expr: { $eq: ['$user', { $toObjectId: user }] },
        },
      },
      {
        $unwind: '$product',
      },
      {
        //Extracting Products
        $lookup: {
          from: 'products',
          localField: 'product.product',
          foreignField: '_id',
          as: 'product.product',
        },
      },
      {
        $unwind: '$product.product',
      },

      {
        $unwind: '$product.product.material',
      },
      {
        $lookup: {
          from: 'materials',
          localField: 'product.product.material.material',
          foreignField: '_id',
          as: 'product.product.material.material',
        },
      },
      {
        $group: {
          _id: {
            product: '$_id.product',
            material: '$product.product.material._id',
          },
          uid: { $first: '$uid' },
          date: { $first: '$date' },
          workOrderNo: { $first: '$workOrderNo' },
          companyName: { $first: '$companyName' },
          qty: { $first: '$qty' },
          product: { $push: '$product' },
        },
      },
      {
        $group: {
          _id: '$product.product._id',
          uid: { $first: '$uid' },
          date: { $first: '$date' },
          workOrderNo: { $first: '$workOrderNo' },
          companyName: { $first: '$companyName' },
          qty: { $first: '$product.qty' },
          productDet: { $first: '$product.product' },
          materialDet: { $push: { $first: '$product.product.material' } },
        },
      },
      {
        $group: {
          _id: '$uid',

          date: { $first: '$date' },
          workOrderNo: { $first: '$workOrderNo' },
          companyName: { $first: '$companyName' },
          product: {
            $push: {
              qty: '$qty',
              productDet: '$productDet',
              materialDet: '$materialDet',
            },
          },
        },
      },
    ];
    console.log(query);
    let ans = await mongoService.aggregate(this.orderModel, query);
    return ans;
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
