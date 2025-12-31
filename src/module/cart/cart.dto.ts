
import { Type } from 'class-transformer';
import {

  IsNotEmpty,
  IsMongoId,
  IsNumber,


} from 'class-validator';
import { Types } from 'mongoose';


export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

}

export class removeCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId
}

