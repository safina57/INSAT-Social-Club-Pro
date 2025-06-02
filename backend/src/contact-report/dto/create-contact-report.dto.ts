import { IsString, IsEmail, IsEnum, IsNotEmpty }from 'class-validator';
import { Category } from '@prisma/client';

export class CreateContactReportDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsString()
  @IsNotEmpty()
  message: string;
}