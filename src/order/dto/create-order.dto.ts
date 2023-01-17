import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  workOrderNo: string;

  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  product: [{ product: ObjectId; qty: Number }];

  @IsOptional()
  active: boolean;
}
