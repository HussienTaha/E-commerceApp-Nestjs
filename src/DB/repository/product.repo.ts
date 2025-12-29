import { Model } from 'mongoose';
import { Product, HProductDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepo extends DBRepo<HProductDocument> {
  constructor(
    @InjectModel(Product.name)
    protected override readonly model: Model<HProductDocument>,
  ) {
      super(model);
  }
}
