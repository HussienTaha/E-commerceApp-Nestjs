import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateAggregationStage, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Category {
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

  @Prop({ type: String})
  assetsFileUrl: string;

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

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

@Prop({ type:[Types.ObjectId], ref: 'Brand' }) 
   brands: Types.ObjectId[];
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId;
}
export type HCategoryDocument = HydratedDocument<Category>;

const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre([ 'findOne', 'findOneAndUpdate',], async function (next) {
   const update = this.getUpdate() as UpdateQuery<Category>;
  if (update?.name) {
    update.slug = slugify(update.name, { replacement: '-', lower: true, trim: true });
  }
  next();
});
CategorySchema.virtual('subCategories', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'categoryId',
});

export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
