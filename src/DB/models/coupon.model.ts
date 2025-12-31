import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Types,
  UpdateAggregationStage,
  UpdateQuery,
} from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Coupon {
  @Prop({
    required: true,
    unique: true,
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
    lowercase: true,
  })
  code: string;

  @Prop({ type: Number, required: true })
  amount: number;
  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  usedBy: Types.ObjectId[];

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}
export type HCouponDocument = HydratedDocument<Coupon>;

const CouponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: CouponSchema },
]);
