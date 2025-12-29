import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { Category } from './category.model'; // لو في نفس الفولدر

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class SubCategory {
  @Prop({
    required: true,
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

  @Prop({ type: String, maxLength: 100, trim: true })
  slogan: string;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ type: String })
  assetsFileUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Brand' })
  brands: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId;
}

export type HSubCategoryDocument = HydratedDocument<SubCategory>;

const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'subCategoryId',
});

SubCategorySchema.pre(['findOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<SubCategory>;
  if (update?.name) {
    update.slug = slugify(update.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
  next();
});

export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);
