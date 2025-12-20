import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Brand {
  @Prop({
    required: true,
    unique: true,
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;
    @Prop({ type: String, maxLength: 100 ,required:true , trim: true })
  slogan: string;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;
  @Prop({ type: Date })
  restoredAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}
export type HBrandDocument = HydratedDocument<Brand>;
const BrandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
