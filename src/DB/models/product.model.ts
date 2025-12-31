import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateAggregationStage, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Product {
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
  slug: string

    @Prop({ type: String,minLength: 10, maxLength: 100000 ,required:true , trim: true })
  description: string;

  @Prop({ required: true, type: String })
  mainImage: string;

  @Prop({ type: [String] })
  subImages: string[];
@Prop({required:true, type:Number})
price : number;

  @Prop({ type:Number, min:0, max:100, default:0 })
discountPercentage : number;


  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Brand' , required: true })
  brandId: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: true })
  subCategoryId: Types.ObjectId;
   

   assetsFileUrl: string;
   

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Number, min:0, max:5, default:0 })
  rateNumber : number;

  @Prop({ type: Number, min:0, max:5, default:0 })
  rateAverage : number;

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
   

  @Prop({ type: Number, default:1 })
  quantity : number;
  @Prop({ type: Number, default:0 ,required:true })
  stock : number;
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId;
}
export type HProductDocument = HydratedDocument<Product>;

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre([ 'findOne', 'findOneAndUpdate',], async function (next) {
   const update = this.getUpdate() as UpdateQuery<Product>;
  if (update?.name) {
    update.slug = slugify(update.name, { replacement: '-', lower: true, trim: true });
  }
  next();
});

// ProductSchema.pre(
//   ['find', 'findOne', 'findOneAndUpdate'],
//   function (next) {
//     const { paranoid, ...rest } = this.getQuery();

//     if (paranoid === false) {
//       this.setQuery({ ...rest, deletedAt: { $exists: true } });
//     } else {
//       this.setQuery({ ...rest, deletedAt: { $exists: false } });
//     }

//     next();
//   }
// );
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
