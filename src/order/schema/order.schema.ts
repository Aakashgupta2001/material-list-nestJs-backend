import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';

import mongoose from 'mongoose';

export type orderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  workOrderNo: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({
    required: true,
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
      },
    ],
  })
  product: [
    {
      product: { type: mongoose.Schema.Types.ObjectId; ref: 'Product' };
      qty: Number;
    },
  ];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: true })
  active: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
