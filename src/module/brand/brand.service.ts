import { S3Service } from 'src/common/service/s3.service';
import type { HUserDocument } from 'src/DB';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BrandRepo } from 'src/DB/repository/brand.repo';
import { CreateBrandDto } from './brand.dto';
import { AppError } from 'src/common/service/errorhanseling';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepo,
    private readonly s3Service: S3Service
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
        await this.s3Service.deleteFile({Key: fileUrl});
      throw new InternalServerErrorException('Failed to create brand');
    }

       
    return brand;



  }
}
   