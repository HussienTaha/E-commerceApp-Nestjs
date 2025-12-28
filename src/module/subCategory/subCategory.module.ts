import { Module } from '@nestjs/common';
import {subCategoryController  } from './subCategory.controller';


import { BrandModel, CategoryModel, CategoryRepo, SubCategoryModel, UserModel, UserRepo } from 'src/DB';

import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';

import { TokenService } from 'src/common/service/token';
import { BrandService } from '../brand/brand.service';
import { subCategoryService } from './subCategory.service'; 
import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';

@Module({
  imports: [UserModel,BrandModel,CategoryModel,SubCategoryModel],
  controllers: [subCategoryController],
  providers: [BrandService ,UserRepo,BrandRepo,S3Service,TokenService, CategoryRepo,subCategoryService,subCategoryRepo ,subCategoryService ]
})
export class subCategoryModule {}