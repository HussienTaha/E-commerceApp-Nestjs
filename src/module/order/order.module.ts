import { Module } from '@nestjs/common';
import { CartModel, CouponModel, CouponRepo, OrderModel, OrderRepo, ProductModel, RevokedTokenModel, RevokedTokenRepo, UserModel, UserRepo } from 'src/DB';
import { S3Service } from 'src/common/service/s3.service';
import { TokenService } from 'src/common/service/token';
import { OrderController } from './oeder.controller';
import { OrderService } from './order.service';
import { CartRepo } from 'src/DB/repository/cart.repo';
import { ProductRepo } from 'src/DB/repository/product.repo';

@Module({
  imports: [UserModel,OrderModel,CouponModel,CartModel ,ProductModel,RevokedTokenModel],
  controllers: [OrderController],
  providers: [OrderService ,UserRepo,CouponRepo,S3Service,TokenService,OrderRepo,CartRepo ,ProductRepo,RevokedTokenRepo ]
})
export class OrderModule {}