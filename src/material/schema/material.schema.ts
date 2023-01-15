import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserSchema  } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';


export type MaterialDocument = Material & Document;

@Schema()
export class Material {

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
  
  @Prop({required: true})
  uid: string;
  
  @Prop({required: true})
  matCode: string;

  @Prop()
  rackNo: string;

  @Prop()
  hsn: string;
  
  @Prop()
  igst: string;
  
  @Prop()
  sgst: string;
  
  @Prop()
  remark: string;

  @Prop()
  rate: Number;
  
  @Prop()
  materialType: String;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User;

  @Prop({ default: true })
  active: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
