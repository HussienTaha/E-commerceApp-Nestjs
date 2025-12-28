import { BrandRepo } from 'src/DB/repository/brand.repo';
import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CategoryRepo } from 'src/DB/repository/category.repo';
import {
  CategoryQueryDto,
  CreateCategoryDto,
  updateCategoryDto,
} from './category.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';


@Injectable()
export class CategoryService {
  constructor(
    private readonly CategoryRepo: CategoryRepo,
    private readonly s3Service: S3Service,
    private readonly BrandRepo: BrandRepo,
  ) {}
  async createCategory(
    CategoryDto: CreateCategoryDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan, brands } = CategoryDto;
    const CategoryExist = await this.CategoryRepo.findOne({ name });
    if (CategoryExist) {
      throw new AppError('Category already exists', 409);
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
      Path: `Category/${user._id}/${file.originalname}`,
    });
    const Category = await this.CategoryRepo.create({
      name,
      slogan,
      createdBy: user._id,
      image: fileUrl,
      assetsFileUrl: `Category/${user._id}/${file.originalname}`,
      brands : stractedIds,
    });
    if (!Category) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to create Category');
    }

    return Category;
  }

  async updateCategory(
    id: Types.ObjectId,
    updateCategoryDto: updateCategoryDto,
    user: HUserDocument,
  ) {
    const { name, slogan  ,brands} = updateCategoryDto;
    const CategoryExists = await this.CategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!CategoryExists) {
      throw new AppError('Category not found', 404);
    }
    const stractedIds= [...new Set(brands || [])];

    const foundBrands = await this.BrandRepo.find({
      _id: { $in: stractedIds },
    });

    if (brands && foundBrands.length !== brands.length) {
      throw new AppError('One or more brands not found', 404);
    }

    const Category = await this.CategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(slogan && { slogan }),
        updatedBy: user._id,
        brands: stractedIds
      },
      { new: true },
    );

    return Category;
  }

  async updateCategoryImage(
    id: Types.ObjectId,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const CategoryExists = await this.CategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!CategoryExists) {
      throw new AppError('Category not found', 404);
    }

    const fileUrl = await this.s3Service.uploadFile({
      file,
      Path: `Category/${user._id}/${file.originalname}`,
    });

    const updatedCategory = await this.CategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        image: fileUrl,
        updatedBy: user._id,
      },
      { new: true },
    );

    if (!updatedCategory) {
      await this.s3Service.deleteFile({ Key: fileUrl });
      throw new InternalServerErrorException('Failed to update Category image');
    }
    await this.s3Service.deleteFile({ Key: CategoryExists.image });

    return updatedCategory;
  }

  async freezeCategory(id: Types.ObjectId, user: HUserDocument) {
    const CategoryExists = await this.CategoryRepo.findOne({
      _id: id,
      deletedAt: { $exists: 'false' },
      createdBy: user._id,
    });

    if (!CategoryExists) {
      throw new AppError('Category not found', 404);
    }
    const updatedCategory = await this.CategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        deletedAt: new Date(),
        updatedBy: user._id,
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedCategory;
  }

  async restoreCategory(id: Types.ObjectId, user: HUserDocument) {
    const CategoryExists = await this.CategoryRepo.findOne({
      _id: id,
      deletedAt: { $exists: true },
      createdBy: user._id,
      paranoid: false,
    });
    if (!CategoryExists) {
      throw new AppError('Category not found or not deleted', 404);
    }
    const updatedCategory = await this.CategoryRepo.findOneAndUpdate(
      { _id: id },
      {
        $unset: { deletedAt: '' },
        updatedBy: user._id,
        restoredAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedCategory;
  }

  async getCategoryById(id: Types.ObjectId) {
    const Category = await this.CategoryRepo.findOne({ _id: id });
    if (!Category) {
      throw new AppError('Category not found', 404);
    }
    return Category;
  }

async getAllCategories(query: CategoryQueryDto) {
  const { page = 1, limit = 10, search } = query;

  return this.CategoryRepo.paginate({
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
      {
        path: 'subCategories',      
        select: 'name  slug slogan image ',   
      },
    ],
  });
}


  // hard delete
  async deleteCategory(id: Types.ObjectId, user: HUserDocument) {
    const CategoryExists = await this.CategoryRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!CategoryExists) {
      throw new AppError('Category not found', 404);
    }
    const deletedCategory = await this.CategoryRepo.deleteOne({
      _id: id,
    });
    return deletedCategory;
  }

  
}
