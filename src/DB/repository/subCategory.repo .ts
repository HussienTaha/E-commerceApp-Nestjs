import { Model } from 'mongoose';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HSubCategoryDocument, SubCategory } from '../models';

@Injectable()
export class subCategoryRepo extends DBRepo<HSubCategoryDocument> {
  constructor(
    @InjectModel(SubCategory.name)
    protected override readonly model: Model<HSubCategoryDocument>,
  ) {
    super(model);
  }
}
