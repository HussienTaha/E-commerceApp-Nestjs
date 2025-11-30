import { Model } from 'mongoose';
import { HOtpDocument, Otp } from '../models';
import { DBRepo } from './DB.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepo extends DBRepo<HOtpDocument> {
  constructor(
    @InjectModel(Otp.name)
    protected override readonly model: Model<HOtpDocument>,
  ) {
      super(model);
  }
}
