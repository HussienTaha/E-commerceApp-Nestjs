import { Module } from '@nestjs/common';
import { CouponModel, CouponRepo, RevokedTokenModel, RevokedTokenRepo, UserModel, UserRepo } from 'src/DB';
import { S3Service } from 'src/common/service/s3.service';
import { TokenService } from 'src/common/service/token';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [UserModel,CouponModel,RevokedTokenModel],
  controllers: [CouponController],
  providers: [CouponService ,UserRepo,CouponRepo,S3Service,TokenService,RevokedTokenRepo ]
})
export class CouponModule {}
