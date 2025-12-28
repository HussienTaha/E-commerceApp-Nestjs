import { Category, HCategoryDocument } from './../models/category.model';
import { Model } from 'mongoose';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepo extends DBRepo<HCategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    protected override readonly model: Model<HCategoryDocument>,
  ) {
      super(model);
  }
}
