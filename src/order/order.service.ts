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
      user: req.user._id,
    });
    createOrderDto['user'] = req.user._id;

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
      user: req.user._id,
      _id: id,
    });
    let materials = await this.getMaterialListFromOrder(id, req.user._id);

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
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: '$product.product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$product.product.material',
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: '$product.product.material.material',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          uid: {
            $first: '$uid',
          },
          date: {
            $first: '$date',
          },
          workOrderNo: {
            $first: '$workOrderNo',
          },
          companyName: {
            $first: '$companyName',
          },
          product: {
            $push: {
              material: '$product.product.material',
              uid: '$product.product.uid',
              productCode: '$product.product.productCode',
              productName: '$product.product.productName',
              user: '$product.product.user',
              qty: '$product.qty',
              _id: '$product.product._id',
            },
          },
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            product: '$product._id',
          },
          uid: {
            $first: '$uid',
          },
          date: {
            $first: '$date',
          },
          workOrderNo: {
            $first: '$workOrderNo',
          },
          companyName: {
            $first: '$companyName',
          },
          product: {
            $push: {
              uid: '$product.uid',
              productCode: '$product.productCode',
              productName: '$product.productName',
              user: '$product.user',
              qty: '$product.qty',
              _id: '$product._id',
              material: '$product.material',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            product: '$product._id',
          },
          uid: {
            $first: '$uid',
          },
          date: {
            $first: '$date',
          },
          workOrderNo: {
            $first: '$workOrderNo',
          },
          companyName: {
            $first: '$companyName',
          },
          productDet: {
            $push: {
              // product: "$product",
              uid: {
                $first: '$product.uid',
              },
              productCode: {
                $first: '$product.productCode',
              },
              productName: {
                $first: '$product.productName',
              },
              user: {
                $first: '$product.user',
              },
              qty: {
                $first: '$product.qty',
              },
              _id: {
                $first: '$product._id',
              },
            },
          },
          materialDet: {
            $push: {
              material: '$product.material',
              // qty: "$product.material.qty",
              //  _id: "$product.material.material._id",
              // 	name: "$product.material.material.name",
              // description: "$product.material.material.description",
              // uid: "$product.material.material.uid",
              // matCode: "$product.material.material.matCode",
              // rackNo: "$product.material.material.rackNo",
              // hsn: "$product.material.material.hsn",
              // igst: "$product.material.material.igst",
              // sgst: "$product.material.material.sgst",
              // remark: "$product.material.material.remark",
              // rate : "$product.material.material.rate",
              // materialType: "$product.material.material.materialType",
            },
          },
        },
      },
      {
        $unwind: {
          path: '$materialDet',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id._id',
            product: '$product._id',
          },
          uid: {
            $first: '$uid',
          },
          date: {
            $first: '$date',
          },
          workOrderNo: {
            $first: '$workOrderNo',
          },
          companyName: {
            $first: '$companyName',
          },
          product: {
            $push: {
              material: '$materialDet.material',
              uid: {
                $first: '$productDet.uid',
              },
              productCode: {
                $first: '$productDet.productCode',
              },
              productName: {
                $first: '$productDet.productName',
              },
              user: {
                $first: '$productDet.user',
              },
              qty: {
                $first: '$productDet.qty',
              },
              _id: {
                $first: '$productDet._id',
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: '$_id._id._id',
            uid: {
              $first: '$uid',
            },
            date: {
              $first: '$date',
            },
            workOrderNo: {
              $first: '$workOrderNo',
            },
            companyName: {
              $first: '$companyName',
            },
            product: {
              $push: '$product',
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
      { user: req.user._id, _id: id },
      { ...updateOrderDto },
    );
  }

  async remove(id: ObjectId, req) {
    return await mongoService.findOneAndHardDelete(this.orderModel, {
      user: req.user._id,
      _id: id,
    });
  }
}
