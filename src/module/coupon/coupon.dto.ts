
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

} from 'class-validator';
import { CouponValidator } from 'src/common/Decorator/coupon.decorator';


export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  code: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Max(100)
  @Min(3)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  @Validate(CouponValidator)
  fromDate: Date;
  @IsNotEmpty()
  @IsDateString()
  toDate: Date;
}
export class UpdateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  code: string;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Max(100)
  @Min(3)
  amount: number;
  @IsNotEmpty()
  @IsDateString()
  @Validate(CouponValidator)
  fromDate: Date
  @IsNotEmpty()
  @IsDateString()
  toDate: Date
}



