import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';


import { BrandModel, CategoryModel, CategoryRepo, UserModel, UserRepo } from 'src/DB';

import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import { TokenName } from 'src/common';
import { TokenService } from 'src/common/service/token';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from './category.service';

@Module({
  imports: [UserModel,BrandModel,CategoryModel],
  controllers: [CategoryController],
  providers: [BrandService ,UserRepo,BrandRepo,S3Service,TokenService, CategoryRepo,CategoryService ]
})
export class CategoryModule {}