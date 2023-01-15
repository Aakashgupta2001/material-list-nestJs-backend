import {IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMaterialDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  matId: string;

  @IsOptional()
  rackNo: string;

  @IsOptional()
  hsn: string;
  
  @IsOptional()
  igst: string;
  
  @IsOptional()
  sgst: string;
  
  @IsOptional()
  remark: string;

  @IsOptional()
  rate: Number;

  @IsOptional()
  active: boolean;
}
