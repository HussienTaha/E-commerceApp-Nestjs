import { BrandRepo } from 'src/DB/repository/brand.repo';
import { UserRepo } from 'src/DB/repository/user.repo';
import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument, } from 'src/DB';
import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryRepo } from 'src/DB/repository/category.repo';
import {
  CreateProductDto,
  updateProductDto,
  ProductQueryDto,
} from './product.dto';
import { AppError } from 'src/common/service/errorhanseling';
import { Types } from 'mongoose';
import { subCategoryRepo } from 'src/DB/repository/subCategory.repo ';
import { ProductRepo } from 'src/DB/repository/product.repo';
 
@Injectable()
export class ProductService {
  constructor(
    private readonly ProductRepo: ProductRepo,
    private readonly userRepo: UserRepo,
    private readonly s3Service: S3Service,
    private readonly brandRepo: BrandRepo,
    private readonly CategoryRepo: CategoryRepo,
    private readonly subCategoryRepo: subCategoryRepo,
  ) {}
  async createProduct(
    ProductDto: CreateProductDto,
    user: HUserDocument,
    files: {
      mainImage?: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
  ) {
    let {
      name,
      description,
      price,
      discountPercentage,
      quantity,
      stock,
      categoryId,
      brandId,
      subCategoryId,
    } = ProductDto;
    const brandExist = await this.brandRepo.findOne({ _id: brandId });
    if (!brandExist) {
      throw new AppError('brand not found', 404);
    }

    const categoryExist = await this.CategoryRepo.findOne({ _id: categoryId });
    if (!categoryExist) {
      throw new AppError('Category not found', 404);
    }
    const subCategoryExist = await this.subCategoryRepo.findOne({
      _id: subCategoryId,
    });
    if (!subCategoryExist) {
      throw new AppError('subCategory not found', 404);
    }
    if (stock < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    if (discountPercentage) {
      price = price - price * (discountPercentage / 100);
    }

    const mainImageFile = files.mainImage?.[0];
    const subImagesFiles = files.subImages || [];

    const mainImageUrl = mainImageFile
      ? await this.s3Service.uploadFile({
          file: mainImageFile,
          Path: `category_Product_MainImage/${user._id}/${mainImageFile.originalname}`,
        })
      : null;

    const subImagesUrls = subImagesFiles
      ? await this.s3Service.uploadFiles({
          files: subImagesFiles,
          path: `Category_Products_subImages/${user._id}/`,
        })
      : [];
    const Product = await this.ProductRepo.create({
      name,
      description,
      price,
      discountPercentage,
      quantity,
      stock,
      mainImage: mainImageUrl!,
      subImages: subImagesUrls,
      createdBy: user._id,
      categoryId: new Types.ObjectId(categoryId),
      brandId: new Types.ObjectId(brandId),
      subCategoryId: new Types.ObjectId(subCategoryId),
    });
    if (!Product) {
      if (mainImageUrl) {
        await this.s3Service.deleteFile({ Key: mainImageUrl });
      }
      if (subImagesUrls) {
        await this.s3Service.deleteFiles({ urls: subImagesUrls });
      }
      throw new InternalServerErrorException('Failed to create Product');
    }

    return Product;
  }

  async updateProduct(
    id: Types.ObjectId,
    updateProductDto: updateProductDto,
    user: HUserDocument,
  ) {
    let {
      name,
      description,
      price,
      discountPercentage,
      quantity,
      stock,
      categoryId,
      brandId,
      subCategoryId,
    } = updateProductDto;
    const ProductExists = await this.ProductRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!ProductExists) {
      throw new AppError('Product not found', 404);
    }
 if (categoryId) {
     const categoryExist = await this.CategoryRepo.findOne({ _id: categoryId });
    if (!categoryExist) {
      throw new AppError('Category not found', 404);
    }
 }

    if (subCategoryId) {
          const subCategoryExist = await this.subCategoryRepo.findOne({
      _id: subCategoryId,
    });
    if (!subCategoryExist) {
      throw new AppError('subCategory not found', 404);
    }
    }

    if (brandId) {
      const brandExist = await this.brandRepo.findOne({ _id: brandId });
      if (!brandExist) {
        throw new AppError('brand not found', 404);
      }
    }

    if (price && discountPercentage) {
      price = price - price * (discountPercentage / 100);
    } else if (price) {
      price = price - price * (ProductExists.discountPercentage / 100);
    } else if (discountPercentage) {
      price =
        ProductExists.price - ProductExists.price * (discountPercentage / 100);
    }

    if (stock && quantity && stock < quantity) {
      throw new BadRequestException('Not enough stock');
    } else if (stock && !quantity && stock < ProductExists.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    const Product = await this.ProductRepo.findOneAndUpdate(
      { _id: id },
      {
  name,
        description,
        price,
        discountPercentage,
        quantity,
        stock,
        categoryId: categoryId
          ? new Types.ObjectId(categoryId)
          : ProductExists.categoryId,
        brandId: brandId
          ? new Types.ObjectId(brandId)
          : ProductExists.brandId,
        subCategoryId: subCategoryId
          ? new Types.ObjectId(subCategoryId)
          : ProductExists.subCategoryId,        updatedBy: user._id,
      },
      { new: true },
    );

    return Product;
  }

  async updateProductImage(
    id: Types.ObjectId,
    user: HUserDocument,
    files:{ mainImage?: Express.Multer.File[]; subImages?: Express.Multer.File[] } ,
  ) {
    const ProductExists = await this.ProductRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!ProductExists) {
      throw new AppError('Product not found', 404);
    }

    const mainImageFile = files.mainImage?.[0];
    const subImagesFiles = files.subImages || [];

    const mainImageUrl = mainImageFile
      ? await this.s3Service.uploadFile({
          file: mainImageFile,
          Path: `category_Product_MainImage/${user._id}/${mainImageFile.originalname}`,
        })
      : null;

    const subImagesUrls = subImagesFiles
      ? await this.s3Service.uploadFiles({
          files: subImagesFiles,
          path: `Category_Products_subImages/${user._id}/`,
        })
      : [];

    const updatedProduct = await this.ProductRepo.findOneAndUpdate(
      { _id: id },
      {
        mainImage: mainImageUrl!,
        subImages: subImagesUrls,
        updatedBy: user._id,
      },
      { new: true },
    );

    if (!updatedProduct) {
      if (mainImageUrl) {
        await this.s3Service.deleteFile({ Key: mainImageUrl });
      }
      if (subImagesUrls) {
        await this.s3Service.deleteFiles({ urls: subImagesUrls });
      }
      throw new InternalServerErrorException('Failed to update Product image');
    }


    if (updatedProduct) {
      await this.s3Service.deleteFile({ Key: ProductExists.mainImage });
      await this.s3Service.deleteFiles({ urls: ProductExists.subImages });
    }
   
    return updatedProduct;
  }

  async freezeProduct(id: Types.ObjectId, user: HUserDocument) {
    const ProductExists = await this.ProductRepo.findOne({
      _id: id,
      deletedAt: { $exists: 'false' },
      createdBy: user._id,
    });

    if (!ProductExists) {
      throw new AppError('Product not found', 404);
    }
    const updatedProduct = await this.ProductRepo.findOneAndUpdate(
      { _id: id },
      {
        deletedAt: new Date(),
        updatedBy: user._id,
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedProduct;
  }

  async unFreezeproduct(id: Types.ObjectId, user: HUserDocument) {
    const subCategoryExists = await this.ProductRepo.findOne({
      _id: id,
      deletedAt: { $exists: true },
      createdBy: user._id,
    
    });
    if (!subCategoryExists) {
      throw new AppError('Product not found or not deleted', 404);
    }
    const updatedProduct = await this.ProductRepo.findOneAndUpdate(
      { _id: id },
      {
        $unset: { deletedAt: '' },
        updatedBy: user._id,
        restoredAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return updatedProduct;
  }

  async getProductById(id: Types.ObjectId) {
    const Product = await this.ProductRepo.findOne(
      { _id: id },
      {},
     {
    populate: [
      { path: 'brandId', select: 'name slug slogan image' },
      { path: 'categoryId', select: 'name slug slogan image' },
      { path: 'subCategoryId', select: 'name slug slogan image' },
    ],
  },
    );
    if (!Product) {
      throw new AppError('Product not found', 404);
    }
    return Product;
  }

  async getAllProducts(query: ProductQueryDto) {
    const { page = 1, limit = 10, search } = query;

    return this.ProductRepo.paginate({
      filter: {
        $or: [
          { name: { $regex: search || '', $options: 'i' } },
          { slogan: { $regex: search || '', $options: 'i' } },
        ],
      },
      query: { page, limit },
      populate: [
        { path: 'brandId', select: 'name slug slogan image' },
      { path: 'categoryId', select: 'name slug slogan image' },
      { path: 'subCategoryId', select: 'name slug slogan image' },
        
      ],
    });
  }

  // hard delete
  async deleteProduct(id: Types.ObjectId, user: HUserDocument) {
    const ProductExists = await this.ProductRepo.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!ProductExists) {
      throw new AppError('Product not found', 404);
    }
    const deletedProduct = await this.ProductRepo.deleteOne({
      _id: id,
    });
    return deletedProduct;
  }

async addToWishList(
    id: Types.ObjectId,
    user: HUserDocument,
  ) {
     const product = await this.ProductRepo.findOne({ _id: id });
  if (!product) {
    throw new BadRequestException('Product not found');
  }

  let userExist = await this.userRepo.findOneAndUpdate(
    { _id: user._id, wishList: { $in: [id] } },
    { $pull: { wishList: id } },
    { new: true }
  );

  if (!userExist) {
    userExist = await this.userRepo.findOneAndUpdate(
      { _id: user._id },
      { $push: { wishList: id } },
      { new: true }
    );
  }

  return userExist;
  }
  


  async getWishList(user: HUserDocument) {
    const userWithWishList = await this.userRepo.findOne(
      { _id: user._id },
      {},
      {
        populate: 
          { path: 'wishList', 
          populate: [
            { path: 'brandId', select: 'name slug slogan image' },
            { path: 'categoryId', select: 'name slug slogan image' },
            { path: 'subCategoryId', select: 'name slug slogan image' },  
          
        ]
      }}
    );
    if (!userWithWishList) {
      throw new AppError('User not found', 404);
    }
    return userWithWishList;
  }


}
