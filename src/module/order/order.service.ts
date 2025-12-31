import { ProductRepo } from 'src/DB/repository/product.repo';

import { CartRepo } from 'src/DB/repository/cart.repo';

import { Injectable } from '@nestjs/common';

import { Types } from 'mongoose';
import { OrderRepo, CouponRepo, HUserDocument } from 'src/DB';
import { CreateOrderDto } from './order.dto';
import { OrderStatusEnum } from 'src/common';
import { log } from 'console';
import { AppError } from 'src/common/service/errorhanseling';
import { IdDto } from '../brand/brand.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly couponRepo: CouponRepo,
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
  ) {}
  async createOrder(OrderDto: CreateOrderDto, user: HUserDocument) {
    const { phone, address, paymentMethod, couponcode } = OrderDto;
    let coupon: any;
    if (couponcode) {
      coupon = await this.couponRepo.findOne({
        code: couponcode,
        usedBy: { $ne: user._id },
      });
      console.log(coupon);
      if (!coupon) {
        throw new AppError('Invalid coupon code', 404);
      }
    }

    const Cart = await this.cartRepo.findOne({ createdBy: user._id });
    if (!Cart || Cart.products.length === 0) {
      throw new AppError('Cart is empty', 404);
    }

    for (const product of Cart.products) {
      const productData = await this.productRepo.findOne({
        _id: product.productId,
        stock: { $gte: product.quantity },
      });
      if (!productData) {
        throw new AppError('Product not found', 404);
      }
    }

    const order = await this.orderRepo.create({
      userId: user._id,
      cartId: Cart._id,
      phone,
      address,
      paymentMethod,
      couponId: couponcode ? coupon._id : undefined,
      totalPrice: couponcode
        ? Cart.subTotal - Cart.subTotal * (coupon.amount / 100)
        : Cart.subTotal,
      orderStatus:
        paymentMethod === 'CASH'
          ? OrderStatusEnum.PENDING
          : OrderStatusEnum.PAID,
      quantity: Cart.products.reduce(
        (total, product) => total + product.quantity,
        0,
      ),
      paymentIntent: 'some_payment_intent', // This should be replaced with actual payment intent
      orderChanges: {},
    });
    console.log(order);
    for (const product of Cart.products) {
      await this.productRepo.findOneAndUpdate(
        {
          _id: product.productId,
        },
        {
          $inc: { stock: -product.quantity },
        },
        {
          new: true,
        },
      );
    }
    if (coupon) {
      await this.couponRepo.findOneAndUpdate(
        {
          _id: coupon._id,
        },
        {
          $push: { usedBy: user._id },
        },
        {
          new: true,
        },
      );
    }

    if (paymentMethod === 'CASH') {

      await this.cartRepo.findOneAndUpdate(
        {
          _id: Cart._id,
        },
        {
          $set: { products: [] },
        },
        {
          new: true,
        },
      );
    }
    return order;
  }

  async cancelOrder(id: Types.ObjectId, user: HUserDocument) {
    const order = await this.orderRepo.findOne(
      { _id: id, userId: user._id },
      {},
      { populate: 'cartId' },
    );
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    if (order.userId.toString() !== user._id.toString()) {
      throw new AppError('You are not allowed to cancel this order', 403);
    }

    if (
      order.orderStatus === OrderStatusEnum.DELIVERED ||
      order.orderStatus === OrderStatusEnum.CANCELED
    ) {
      throw new AppError(
        `Order cannot be canceled when status is ${order.orderStatus}`,
        400,
      );
    }

    const cart = await this.cartRepo.findOne({ _id: order.cartId });
    console.log({ cart });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    for (const product of cart.products) {
      await this.productRepo.findOneAndUpdate(
        { _id: product.productId },
        { $inc: { stock: product.quantity } },
        { new: true },
      );
    }

    if (order.couponId) {
      await this.couponRepo.findOneAndUpdate(
        { _id: order.couponId },
        { $pull: { usedBy: user._id }, $inc: { usedCount: -1 } },
        { new: true },
      );
    }

    order.orderStatus = OrderStatusEnum.CANCELED;

    await order.save();
    return order;
  }
}
