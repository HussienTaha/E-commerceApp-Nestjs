import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import type {  HUserDocument } from 'src/DB';
import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryRepo } from 'src/DB/repository/category.repo';
import {

  CartQueryDto,
  updateCartDto,
  CreateCartDto,
} from './cart.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';
import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';
import { ProductRepo } from 'src/DB/repository/product.repo';
import { CartRepo } from 'src/DB/repository/cart.repo';
// import { CartRepo } from 'src/DB/repository/cart.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly s3Service: S3Service,
    private readonly brandRepo: BrandRepo,
      private readonly productRepo: ProductRepo,
    private readonly CategoryRepo: CategoryRepo,
    private readonly subCategoryRepo: subCategoryRepo,
  ) {}
async createCart(
  CartDto: CreateCartDto,
  user: HUserDocument,
) {
  const { productId, quantity } = CartDto;
console.log(productId, quantity);

  const productExist = await this.productRepo.findOne({
    _id: productId,
   
  });
 

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
  } 
  else {
    cart.products.push({
      productId,
      quantity,
      finalPrice: productExist.price,
    });
  }

  await cart.save();
  return cart;
}
}



