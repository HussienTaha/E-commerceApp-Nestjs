import type { HUserDocument } from 'src/DB';
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Types } from 'mongoose';

@Controller('Coupons')
export class CouponController {
  constructor(private readonly CouponService: CouponService) {}

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/create')
  async createCoupon(
    @Body() CouponDto: CreateCouponDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const Coupon = await this.CouponService.createCoupon(CouponDto, user);
    return { message: 'Coupon created successfully', Coupon };
  }


@Patch('update/:id')
@Token(TokenType.access)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
async updateCoupon(
  @Param('id') id: Types.ObjectId,
  @Body() updateCouponDto: UpdateCouponDto,
  @UserDecorator() user: HUserDocument,
) {
  const coupon = await this.CouponService.updateCoupon(id, updateCouponDto, user);
  return { message: 'Coupon updated successfully', coupon };
}





  @Delete('delete/:id')
@Token(TokenType.access)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN , USER_ROLE.USER)
async deleteCoupon(
  @Param('id') id: Types.ObjectId,
  @UserDecorator() user: HUserDocument,
) {
  const coupon = await this.CouponService.deleteCoupon(id, user);
  return { message: 'Coupon deleted successfully' };
}


  @Patch('restore/:id')
@Token(TokenType.access)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN , USER_ROLE.USER)
async restoreCoupon(
  @Param('id') id: Types.ObjectId,
  @UserDecorator() user: HUserDocument,
) {
  const coupon = await this.CouponService.restoreCoupon(id, user);
  return { message: 'Coupon restored successfully',coupon };
}


}
