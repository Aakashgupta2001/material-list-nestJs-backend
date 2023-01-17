import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Material } from 'src/material/schema/material.schema';

export type productDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  productCode: string;

  @Prop({ required: true })
  productName: string;

  @Prop({
    required: true,
    type: [
      {
        material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
        qty: Number,
      },
    ],
    // ref: 'Material',
  })
  material: [
    {
      material: { type: mongoose.Schema.Types.ObjectId; ref: 'Material' };
      qty: Number;
    },
  ];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: true })
  active: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
