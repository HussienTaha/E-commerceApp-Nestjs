import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateAggregationStage, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class CartProduct {


  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;


  @Prop({ type: Number, required: true, min: 0 })
  finalPrice: number;


}
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Cart {

  @Prop({ type: [CartProduct], default: [] })
  products: CartProduct[];


  @Prop({ type: Number})
  subTotal: number;

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

  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId;
}



export type HCartDocument = HydratedDocument<Cart>;

const CartSchema = SchemaFactory.createForClass(Cart);
// CartSchema.virtual('productsDetails', {
//   ref: 'Product',
//   localField: 'products.productId',  // جوا الـ array
//   foreignField: '_id',
//   justOne: false,
// });

 CartSchema.pre('save', async function (next) {
   this.subTotal = this.products.reduce((total, product) => total + (product.finalPrice * product.quantity), 0);
   next();
 });

export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
