import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class MaterialFromProductDto {
  @IsNotEmpty()
  qty: Number;
}
