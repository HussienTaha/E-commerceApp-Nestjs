import { PartialType } from '@nestjs/mapped-types';
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

export class CreatesubCategoryDto {
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
  brands : Types.ObjectId[];

@IsMongoId()
@IsOptional()
  categoryId: Types.ObjectId;
}

@AtlastOne(['name', 'slogan', 'brands'] )
export class updatesubCategoryDto extends PartialType(CreatesubCategoryDto) {}

export class IdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}

export class subCategoryQueryDto {
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
