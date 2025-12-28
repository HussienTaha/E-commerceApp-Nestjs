import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CategoryRepo } from 'src/DB/repository/category.repo';
import {

  CreatesubCategoryDto,
  subCategoryQueryDto,

  updatesubCategoryDto,
} from './subCategory.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';
import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';


@Injectable()
export class subCategoryService {
  constructor(
    private readonly subCategoryRepo: subCategoryRepo,
    private readonly s3Service: S3Service,
    private readonly BrandRepo: BrandRepo,
    private readonly CategoryRepo: CategoryRepo,
  ) {}
  async createsubCategory(
    subCategoryDto: CreatesubCategoryDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan, brands ,categoryId} = subCategoryDto;
    const subCategoryExist = await this.subCategoryRepo.findOne({ name });
    if (subCategoryExist) {
      throw new AppError('subCategory already exists', 409);
    }

    const categoryExist = await this.CategoryRepo.findOne({ _id: categoryId });
    if (!categoryExist) {
      throw new AppError('Category not found', 404);
    }

     const stractedIds= [...new Set(brands || [])];

    const foundBrands = await this.BrandRepo.find({
      _id: { $in: stractedIds },
    });

    if (brands && foundBrands.length !== brands.length) {
      throw new AppError('One or more brands not found', 404);
    }

    const fileUrl = await this.s3Service.uploadFile({
      file,
      Path: `subCategory/${user._id}/${file.originalname}`,
    });
    const subCategory = await this.subCategoryRepo.create({
      name,
      slogan,
      createdBy: user._id,
      image: fileUrl,
      assetsFileUrl: `subCategory/${user._id}/${file.originalname}`,
      brands : stractedIds,
      categoryId:new Types.ObjectId(categoryId)
    });
    if (!subCategory) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to create subCategory');
    }

    return subCategory;
  }

  async updatesubCategory(
    id: Types.ObjectId,
    updatesubCategoryDto: updatesubCategoryDto,
    user: HUserDocument,
  ) {
    const { name, slogan  ,brands} = updatesubCategoryDto;
    const subCategoryExists = await this.subCategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!subCategoryExists) {
      throw new AppError('subCategory not found', 404);
    }
    const stractedIds= [...new Set(brands || [])];

    const foundBrands = await this.BrandRepo.find({
      _id: { $in: stractedIds },
    });

    if (brands && foundBrands.length !== brands.length) {
      throw new AppError('One or more brands not found', 404);
    }

    const subCategory = await this.subCategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(slogan && { slogan }),
        updatedBy: user._id,
        brands:stractedIds
      },
      { new: true },
    );

    return subCategory;
  }

  async updatesubCategoryImage(
    id: Types.ObjectId,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const subCategoryExists = await this.subCategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!subCategoryExists) {
      throw new AppError('subCategory not found', 404);
    }

    const fileUrl = await this.s3Service.uploadFile({
      file,
      Path: `subCategory/${user._id}/${file.originalname}`,
    });

    const updatedsubCategory = await this.subCategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        image: fileUrl,
        updatedBy: user._id,
      },
      { new: true },
    );

    if (!updatedsubCategory) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to update subCategory image');
    }
    await this.s3Service.deleteFile({ Key: subCategoryExists.image });

    return updatedsubCategory;
  }

  async freezesubCategory(id: Types.ObjectId, user: HUserDocument) {
    const subCategoryExists = await this.subCategoryRepo.findOne({
      _id: id,
      deletedAt: { $exists: 'false' },
      createdBy: user._id,
    });

    if (!subCategoryExists) {
      throw new AppError('subCategory not found', 404);
    }
    const updatedsubCategory = await this.subCategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        deletedAt: new Date(),
        updatedBy: user._id,
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedsubCategory;
  }

  async restoresubCategory(id: Types.ObjectId, user: HUserDocument) {
    const subCategoryExists = await this.subCategoryRepo.findOne({
      _id: id,
      deletedAt: { $exists: true },
      createdBy: user._id,
      paranoid: false,
    });
    if (!subCategoryExists) {
      throw new AppError('subCategory not found or not deleted', 404);
    }
    const updatedsubCategory = await this.subCategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        $unset: { deletedAt: '' },
        updatedBy: user._id,
        restoredAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedsubCategory;
  }

  async getsubCategoryById(id: Types.ObjectId) {
    const subCategory = await this.subCategoryRepo.findOne({ _id: id },  {},{ populate: 'brands' });
    if (!subCategory) {
      throw new AppError('subCategory not found', 404);
    }
    return subCategory;
  }

async getAllsubCategorys(query: subCategoryQueryDto) {
  const { page = 1, limit = 10, search } = query;

  return this.subCategoryRepo.paginate({
    filter: {
      $or: [
        { name: { $regex: search || '', $options: 'i' } },
        { slogan: { $regex: search || '', $options: 'i' } },
      ],
    },
    query: { page, limit },
    populate: [
      {
        path: 'brands',       
        select: 'name  slug slogan image',  
      },
    ],
  });
}


  // hard delete
  async deletesubCategory(id: Types.ObjectId, user: HUserDocument) {
    const subCategoryExists = await this.subCategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!subCategoryExists) {
      throw new AppError('subCategory not found', 404);
    }
    const deletedsubCategory = await this.subCategoryRepo.deleteOne({
      _id: id,
    });
    return deletedsubCategory;
  }
}
