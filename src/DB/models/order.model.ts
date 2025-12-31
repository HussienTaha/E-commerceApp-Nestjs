import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Types,

} from 'mongoose';
import slugify from 'slugify';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/common';


@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  couponId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: Date, required: true, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
  arriveAt: Date;
  @Prop({ type: String, enum: PaymentMethodEnum, default: PaymentMethodEnum.CASH, required: true })
  paymentMethod: PaymentMethodEnum;

  @Prop({ type: String, enum: OrderStatusEnum, required: true, default: OrderStatusEnum.PENDING })
  orderStatus: OrderStatusEnum

  @Prop({ type: String, required: true })
   paymentIntent: string;
  @Prop({ type: {paidAt : Date,
    deliveredAt : Date,
    deliveredBy : { type: Types.ObjectId, ref: 'User' },
    canceledAt : Date,
    canceledBy : { type: Types.ObjectId, ref: 'User' },
    refundedAt : Date,
    refundedBy : { type: Types.ObjectId, ref: 'User' },
  } })
  orderChanges: object;
}
export type HOrderDocument = HydratedDocument<Order>;
const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);
