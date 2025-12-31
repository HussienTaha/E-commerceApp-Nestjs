import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable } from '@nestjs/common';

import { CreateCartDto } from './cart.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';
import { ProductRepo } from 'src/DB/repository/product.repo';
import { CartRepo } from 'src/DB/repository/cart.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}
  async createCart(CartDto: CreateCartDto, user: HUserDocument) {
    const { productId, quantity } = CartDto;
    console.log(productId, quantity);

    const productExist = await this.productRepo.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      {
        new: true,
      },
    );
    if (!productExist) {
      throw new AppError('Product not found or out of stock', 404);
    }

    let cart = await this.cartRepo.findOne({
      createdBy: user._id,
    });

    if (!cart) {
      cart = await this.cartRepo.create({
        createdBy: user._id,
        products: [
          {
            productId,
            quantity,
            finalPrice: productExist.price,
          },
        ],
      });

      return cart;
    }

    const productInCart = cart.products.find(
      (p) => p.productId.toString() === productId.toString(),
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({
        productId,
        quantity,
        finalPrice: productExist.price,
      });
    }

    await cart.save();
    return cart;
  }
  async removeCart(productId: Types.ObjectId, user: HUserDocument) {
    const productExist = await this.productRepo.findOne({ _id: productId });
    if (!productExist) {
      throw new AppError('Product not found', 404);
    }

    const cart = await this.cartRepo.findOne({
      createdBy: user._id,
      'products.productId': productId,
    });

    if (!cart) {
      throw new AppError('Cart or product not found', 404);
    }



    const productInCart = cart.products.find(
      (p) => p.productId.toString() === productId.toString(),
    );

    if (!productInCart) {
      throw new AppError('Product not found in cart', 404);
    }

    productInCart.quantity -= 1;

    productExist.stock += 1;
    await productExist.save();

    if (productInCart.quantity === 0) {
      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId.toString(),
      );
    }

    await cart.save();
    return cart;
  }

  async clearCart(user: HUserDocument) {
    const cart = await this.cartRepo.findOne({ createdBy: user._id });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    for (const item of cart.products) {
      const product = await this.productRepo.findOne({ _id: item.productId });
      if (product) {
        product.stock += item.quantity as number;
        await product.save();
      }
    }
    cart.products = [];
    await cart.save();
    return cart;
  }
}
