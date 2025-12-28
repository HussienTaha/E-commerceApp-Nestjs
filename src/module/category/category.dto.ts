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
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { AtlastOne, Idsmongo } from 'src/common';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slogan: string;

@Validate(Idsmongo)
@IsOptional()
 @Type(() => String)
  brands : Types.ObjectId[];
}

@AtlastOne(['name', 'slogan', 'brands'] )
export class updateCategoryDto extends PartialType(CreateCategoryDto) {}

export class IdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}

export class CategoryQueryDto {
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
