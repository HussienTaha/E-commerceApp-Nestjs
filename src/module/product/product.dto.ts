import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsMongoId,
  IsNumber,
  IsOptional,

} from 'class-validator';
import { Types } from 'mongoose';
import { AtlastOne, Idsmongo } from 'src/common';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MaxLength(10000)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPercentage: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock: number;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: Types.ObjectId;
  @IsMongoId()
  @IsNotEmpty()
  brandId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  subCategoryId: Types.ObjectId;
}

@AtlastOne(['categoryId', 'brandId', 'subCategoryId', 'name', 'description', 'price', 'discountPercentage', 'quantity', 'stock'])
export class updateProductDto extends PartialType(CreateProductDto) {}

export class IdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}

export class ProductQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
