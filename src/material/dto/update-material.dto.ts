import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateMaterialDto } from './create-material.dto';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  matCode: string;

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
  materialType: String;

  @IsOptional()
  active: boolean;
}
