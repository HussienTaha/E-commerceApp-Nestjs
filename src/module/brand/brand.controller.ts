import type { HUserDocument } from 'src/DB';
import { Body, Controller, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './brand.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES } from 'src/common/fileType';
import { multerCloud } from 'src/common/utils/multer';


@Controller('brands')
export class BrandController {
constructor( private readonly brandService: BrandService 
    
) {}

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @UseInterceptors( FileInterceptor("attachment",
    multerCloud({
      fileTypes: Object.values(FILE_TYPES.IMAGES),
    }),
  ),)
   @Post("/create")
  async createBrand (@Body() BrandDto: CreateBrandDto, @UserDecorator() user: HUserDocument, @UploadedFile(ParseFilePipe ) file: Express.Multer.File) {
     const brand = await this.brandService.createBrand(BrandDto, user, file);
        return { message: 'Brand created successfully', brand };
  }
}
