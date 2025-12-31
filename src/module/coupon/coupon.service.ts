import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable } from '@nestjs/common';

import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { CouponRepo } from 'src/DB';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepo: CouponRepo,
    private readonly s3Service: S3Service,
  ) {}
  async createCoupon(CouponDto: CreateCouponDto, user: HUserDocument) {
    const { code, amount, fromDate, toDate } = CouponDto;
    const existingCoupon = await this.couponRepo.findOne({
      code: code.toLowerCase(),
    });
    if (existingCoupon) {
      throw new AppError('Coupon code already exists', 400);
    }
    const coupon = await this.couponRepo.create({
      code: code.toLowerCase(),
      amount,
      fromDate,
      toDate,
      createdBy: user._id,
    });
    if (!coupon) {
      throw new AppError('Failed to create coupon', 500);
    }
    return coupon;

    // hard delete
  }

  async updateCoupon(
    couponId: Types.ObjectId,
    updateCouponDto: UpdateCouponDto,
    user: HUserDocument,
  ) {
    const { code } = updateCouponDto;
    const coupon = await this.couponRepo.findOne({ _id: couponId });
    if (!coupon) {
      throw new AppError('Coupon not found', 404);
    }

    if (code) {
      const existingCoupon = await this.couponRepo.findOne({
        code: updateCouponDto.code.toLowerCase(),
        _id: { $ne: couponId },
      });

      if (existingCoupon) {
        throw new AppError('Coupon code already exists', 400);
      }

      updateCouponDto.code = updateCouponDto.code.toLowerCase();
    }

    const updatedCoupon = await this.couponRepo.findOneAndUpdate(
      { _id: couponId },
      {
        ...updateCouponDto,
        updatedBy: user._id,
      },
      { new: true },
    );

    return updatedCoupon;
  }

  async deleteCoupon(couponId: Types.ObjectId, user: HUserDocument) {
    const coupon = await this.couponRepo.findOne({ _id: couponId });
    if (!coupon) {
      throw new AppError('Coupon not found', 404);
    }

    const deletedCoupon = await this.couponRepo.findOneAndUpdate(
      { _id: couponId },
      {
        deletedAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );

    return deletedCoupon;
  }

  async restoreCoupon(couponId: Types.ObjectId, user: HUserDocument) {
    const coupon = await this.couponRepo.findOne({
      _id: couponId,
      deletedAt: { $exists: true },
    });
    if (!coupon) {
      throw new AppError('Coupon not found or not deleted', 404);
    }

    const restoredCoupon = await this.couponRepo.findOneAndUpdate(
      { _id: couponId },
      {
        deletedAt: undefined,
        updatedBy: user._id,
        restoredAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return restoredCoupon;
  }
}
