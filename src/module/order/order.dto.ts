

import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  Max,
  Min,
  IsPositive,
  IsDateString,
  validate,
  Validate,
  IsEnum,
  IsOptional,
  IsMongoId,

} from 'class-validator';
import { PaymentMethodEnum } from 'src/common';



export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)

  address: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone!: string;

  @IsNotEmpty()
  @IsDateString()
   @IsOptional()
  arriveAt?: Date

@IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsString()
  @IsOptional()
  couponcode?: string;


}
export class cancleOrderDto {
  @IsNotEmpty()
 @IsMongoId()
  orderId: string

}



