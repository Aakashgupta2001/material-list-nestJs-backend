import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, orderDocument } from './schema/order.schema';
import { Model, mongo, ObjectId } from 'mongoose';
import { generateRandomString } from 'src/helpers/helpers';
import * as mongoService from '../helpers/mongoService/mongoService';

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
    return await mongoService.findOne(this.orderModel, {
      user: req.user.id,
      _id: id,
    });
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
