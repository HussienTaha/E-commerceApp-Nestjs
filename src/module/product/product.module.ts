import { Module } from '@nestjs/common';
import {productController  } from './product.controller';


import { BrandModel, CategoryModel, CategoryRepo, ProductModel, RevokedTokenModel, RevokedTokenRepo, SubCategoryModel, UserModel, UserRepo } from 'src/DB';

import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';

import { TokenService } from 'src/common/service/token';
import { BrandService } from '../brand/brand.service';

import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';
import { ProductService } from './product.service';
import { ProductRepo } from 'src/DB/repository/product.repo';

@Module({
  imports: [UserModel,BrandModel,CategoryModel,SubCategoryModel, ProductModel, RevokedTokenModel],
  controllers: [productController],
  providers: [BrandService ,UserRepo,BrandRepo,S3Service,TokenService, CategoryRepo,subCategoryRepo , ProductService ,ProductRepo,RevokedTokenRepo]
})
export class ProductModule {}