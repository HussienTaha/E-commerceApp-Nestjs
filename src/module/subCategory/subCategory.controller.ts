import type { HUserDocument } from 'src/DB';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { subCategoryService } from './subCategory.service';
import { CreatesubCategoryDto, IdDto, subCategoryQueryDto, updatesubCategoryDto } from './subCategory.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES } from 'src/common/fileType';
import { multerCloud } from 'src/common/utils/multer';
import { Types } from 'mongoose';

@Controller('subcategory')
export class subCategoryController {
  constructor(private readonly subCategoryService: subCategoryService) {}

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  @Post('/create')
  async createsubCategory(
    @Body() subCategoryDto: CreatesubCategoryDto,
    @UserDecorator() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const subCategory = await this.subCategoryService.createsubCategory(subCategoryDto, user, file);
    return { message: 'subCategory created successfully', subCategory };
  }




  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/update/:id')
  async updatesubCategory(
    @Param() params: IdDto,
    @Body() updatesubCategoryDto: updatesubCategoryDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const subCategory = await this.subCategoryService.updatesubCategory( params.id , updatesubCategoryDto, user);
    return { message: 'subCategory updated successfully', subCategory };
  }


  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  @Patch('/updateImage/:id')
  async updatesubCategoryImage(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,
     @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const subCategoryImage = await this.subCategoryService.updatesubCategoryImage( params.id ,user, file);
    return { message: 'subCategory updated successfully', subCategoryImage };
  }






  

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/freeze/:id')
  async freezesubCategory(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,

  ) {
    const updatedsubCategory = await this.subCategoryService.freezesubCategory( params.id ,user);
    return { message: 'subCategory freezed successfully', updatedsubCategory };
  }



  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Patch('/unFreeze/:id')
   async restoresubCategory(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updatedsubCategory = await this.subCategoryService.restoresubCategory( params.id ,user);
     return { message: 'subCategory unFreezed successfully', updatedsubCategory };
   }

  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Delete('/delete/:id')
   async DeletesubCategory(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updatedsubCategory = await this.subCategoryService.deletesubCategory( params.id ,user);
     return { message: 'subCategory deleted successfully', updatedsubCategory };
   }


   
  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/get/:id')
   async getOnesubCategory(
     @Param() params: IdDto,
 
   ) {
     const updatedsubCategory = await this.subCategoryService.getsubCategoryById(params.id);
     return { message: ' success to get subCategory  ', updatedsubCategory };
   }



    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/getall')
   async getAllsubCategory(

    @Query() query: subCategoryQueryDto,
   ) {

     const updatedsubCategory = await this.subCategoryService.getAllsubCategorys(query);
     return { message: ' success to get subCategory successfully', updatedsubCategory };
   }

}
