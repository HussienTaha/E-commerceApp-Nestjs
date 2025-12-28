import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BrandRepo } from 'src/DB/repository/brand.repo';
import { BrandQueryDto, CreateBrandDto, updateBrandDto } from './brand.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepo: BrandRepo,
    private readonly s3Service: S3Service,
  ) {}
  async createBrand(
    BrandDto: CreateBrandDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan } = BrandDto;
    const brandExist = await this.brandRepo.findOne({ name });
    if (brandExist) {
      throw new AppError('Brand already exists', 409);
    }
    const fileUrl = await this.s3Service.uploadFile({
      file,
      Path: `brand/${user._id}/${file.originalname}`,
    });
    const brand = await this.brandRepo.create({
      name,
      slogan,
      createdBy: user._id,
      image: fileUrl,
    });
    if (!brand) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to create brand');
    }

    return brand;
  }

  async updateBrand(
    id: Types.ObjectId,
    updateBrandDto: updateBrandDto,
    user: HUserDocument,
  ) {
    const { name, slogan } = updateBrandDto;
    const brandExists = await this.brandRepo.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!brandExists) {
      throw new AppError('Brand not found', 404);
    }

    const Brand = await this.brandRepo.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(slogan && { slogan }),
        updatedBy: user._id,
      },
      { new: true },
    );

    return Brand;
  }

  async updateBrandImage(
    id: Types.ObjectId,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const brandExists = await this.brandRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!brandExists) {
      throw new AppError('Brand not found', 404);
    }

    const fileUrl = await this.s3Service.uploadFile({
      file,
      Path: `brand/${user._id}/${file.originalname}`,
    });

    const updatedBrand = await this.brandRepo.findOneAndUpdate(
      { _id: id },
      {
        image: fileUrl,
        updatedBy: user._id,
      },
      { new: true },
    );

    if (!updatedBrand) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to update brand image');
    }
    await this.s3Service.deleteFile({ Key: brandExists.image });

    return updatedBrand;
  }

  async freezeBrand(id: Types.ObjectId, user: HUserDocument) {
    const brandExists = await this.brandRepo.findOne({
      _id: id,
      deletedAt: { $exists: 'false' },
      createdBy: user._id,
    });

    if (!brandExists) {
      throw new AppError('Brand not found', 404);
    }
    const updatedBrand = await this.brandRepo.findOneAndUpdate(
      { _id: id },
      {
        deletedAt: new Date(),
        updatedBy: user._id,
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedBrand;
  }

  async restoreBrand(id: Types.ObjectId, user: HUserDocument) {
    const brandExists = await this.brandRepo.findOne({
      _id: id,
      deletedAt: { $exists: true },
      createdBy: user._id,
      paranoid: false,
    });
    if (!brandExists) {
      throw new AppError('Brand not found or not deleted', 404);
    }
    const updatedBrand = await this.brandRepo.findOneAndUpdate(
      { _id: id },
      {
        $unset: { deletedAt: '' },
        updatedBy: user._id,
        restoredAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedBrand;
  }

  async getBrandById(id: Types.ObjectId) {
    const brand = await this.brandRepo.findOne({ _id: id });
    if (!brand) {
      throw new AppError('Brand not found', 404);
    }
    return brand;
  }

  async getAllBrands(query: BrandQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const { docs,
    currentPage,
    count,
    numberOfPages, } =
      await this.brandRepo.paginate({
        filter: { $or: [
          { name: { $regex: search || '', $options: 'i' } },
          { slogan: { $regex: search || '', $options: 'i' } },
        ] },
        query: { page, limit },
      });
    return { docs, currentPage,
    count,
    numberOfPages, };
  }

  // hard delete
  async deleteBrand(id: Types.ObjectId, user: HUserDocument) {
    const brandExists = await this.brandRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!brandExists) {
      throw new AppError('Brand not found', 404);
    }
    const deletedBrand = await this.brandRepo.deleteOne({
      _id: id,
    });
    return deletedBrand;
  }
}
