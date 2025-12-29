import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsOptional,

} from 'class-validator';
import { Types } from 'mongoose';
import { AtlastOne, Idsmongo } from 'src/common';

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

}

@AtlastOne(['categoryId', 'brandId', 'subCategoryId', 'name', 'description', 'price', 'discountPercentage', 'quantity', 'stock'])
export class updateCartDto extends PartialType(CreateCartDto) {}

export class IdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}

export class CartQueryDto {
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
