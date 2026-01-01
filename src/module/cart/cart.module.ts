import { Module } from '@nestjs/common';
import {CartController  } from './cart.controller';


import { BrandModel, CategoryModel, CategoryRepo, CartModel, SubCategoryModel, UserModel, UserRepo, ProductModel, RevokedTokenModel, RevokedTokenRepo,   } from 'src/DB';

import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';

import { TokenService } from 'src/common/service/token';
import { BrandService } from '../brand/brand.service';

import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';
import { CartService } from './cart.service';
import { CartRepo } from 'src/DB/repository/cart.repo';
import { ProductRepo } from 'src/DB/repository/product.repo';


@Module({
  imports: [UserModel,BrandModel,CategoryModel,SubCategoryModel, CartModel,ProductModel,RevokedTokenModel],
  controllers: [CartController],
  providers: [BrandService ,UserRepo,BrandRepo,S3Service,TokenService, CategoryRepo,subCategoryRepo , CartService ,CartRepo,ProductRepo ,RevokedTokenRepo]
})
export class CartModule {}