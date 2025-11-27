import { Model } from 'mongoose';
import { HUserDocument, User } from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepo extends DBRepo<HUserDocument> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<HUserDocument>,
  ) {
      super(model);
  }
}
