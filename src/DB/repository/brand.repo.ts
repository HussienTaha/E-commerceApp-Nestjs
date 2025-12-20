import { Model } from 'mongoose';
import { Brand, HBrandDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandRepo extends DBRepo<HBrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    protected override readonly model: Model<HBrandDocument>,
  ) {
      super(model);
  }
}
