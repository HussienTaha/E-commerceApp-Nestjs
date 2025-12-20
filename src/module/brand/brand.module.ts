import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

import { BrandModel, UserModel, UserRepo } from 'src/DB';

import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import { TokenName } from 'src/common';
import { TokenService } from 'src/common/service/token';

@Module({
  imports: [UserModel,BrandModel],
  controllers: [BrandController],
  providers: [BrandService ,UserRepo,BrandRepo,S3Service,TokenService, ]
})
export class BrandModule {}
