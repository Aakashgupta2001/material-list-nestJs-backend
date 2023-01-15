import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  productCode: string;

  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  material: [ObjectId];

  @IsNotEmpty()
  user: ObjectId;

  @IsOptional()
  active: boolean;
}
