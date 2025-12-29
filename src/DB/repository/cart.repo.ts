import { Model } from 'mongoose';
import { Cart, HCartDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartRepo extends DBRepo<HCartDocument> {
  constructor(
    @InjectModel(Cart.name)
    protected override readonly model: Model<HCartDocument>,
  ) {
      super(model);
  }
}
