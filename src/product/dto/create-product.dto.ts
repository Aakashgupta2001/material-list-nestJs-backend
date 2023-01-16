import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  productCode: string;

  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  material: [{ material: ObjectId; qty: Number }];

  @IsOptional()
  active: boolean;
}
