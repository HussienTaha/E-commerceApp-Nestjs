import { Model } from 'mongoose';
import { Coupon, HCouponDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CouponRepo extends DBRepo<HCouponDocument> {
  constructor(
    @InjectModel(Coupon.name)
    protected override readonly model: Model<HCouponDocument>,
  ) {
      super(model);
  }
}
