import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  companyName: string;

  @IsOptional()
  roles: [string];

  @IsOptional()
  active: boolean;
}
