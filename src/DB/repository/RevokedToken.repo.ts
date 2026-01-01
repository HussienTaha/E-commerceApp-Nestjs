import { Model } from 'mongoose';
import { RevokedToken, HRevokedTokenDocument,} from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RevokedTokenRepo extends DBRepo<HRevokedTokenDocument> {
  constructor(
    @InjectModel(RevokedToken.name)
    protected override readonly model: Model<HRevokedTokenDocument>,
  ) {
      super(model);
  }
}
