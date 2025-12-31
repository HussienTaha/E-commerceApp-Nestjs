import { Model } from 'mongoose';
import { Order, HOrderDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepo extends DBRepo<HOrderDocument> {
  constructor(
    @InjectModel(Order.name)
    protected override readonly model: Model<HOrderDocument>,
  ) {
      super(model);
  }
}
