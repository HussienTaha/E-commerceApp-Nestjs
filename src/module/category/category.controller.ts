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
import { CategoryService } from './category.service';
import { CategoryQueryDto, CreateCategoryDto, IdDto, updateCategoryDto } from './category.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES } from 'src/common/fileType';
import { multerCloud } from 'src/common/utils/multer';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

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
  async createCategory(
    @Body() CategoryDto: CreateCategoryDto,
    @UserDecorator() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const Category = await this.CategoryService.createCategory(CategoryDto, user, file);
    return { message: 'Category created successfully', Category };
  }




  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/update/:id')
  async updateCategory(
    @Param() params: IdDto,
    @Body() updateCategoryDto: updateCategoryDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const Category = await this.CategoryService.updateCategory( params.id , updateCategoryDto, user);
    return { message: 'Category updated successfully', Category };
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
  async updateCategoryImage(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,
     @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const CategoryImage = await this.CategoryService.updateCategoryImage( params.id ,user, file);
    return { message: 'Category updated successfully', CategoryImage };
  }






  

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/freeze/:id')
  async freezeCategory(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,

  ) {
    const updatedCategory = await this.CategoryService.freezeCategory( params.id ,user);
    return { message: 'Category freezed successfully', updatedCategory };
  }



  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Patch('/unFreeze/:id')
   async restoreCategory(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updatedCategory = await this.CategoryService.restoreCategory( params.id ,user);
     return { message: 'Category unFreezed successfully', updatedCategory };
   }

  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Patch('/delete/:id')
   async DeleteCategory(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updatedCategory = await this.CategoryService.deleteCategory( params.id ,user);
     return { message: 'Category deleted successfully', updatedCategory };
   }


   
  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/get/:id')
   async getOneCategory(
     @Param() params: IdDto,
 
   ) {
     const updatedCategory = await this.CategoryService.getCategoryById(params.id);
     return { message: ' success to get Category  ', updatedCategory };
   }



    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/getall')
   async getAllCategory(

    @Query() query: CategoryQueryDto,
   ) {

     const updatedCategory = await this.CategoryService.getAllCategories(query);
     return { message: ' success to get Category successfully', updatedCategory };
   }


    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Delete('/deleteone')
   async deleteoneCategory(
  @Param() params: IdDto,
    @Query() query: CategoryQueryDto,
    @UserDecorator() user: HUserDocument,
   ) {

     const updatedCategory = await this.CategoryService.deleteCategory(params.id, user);
     return { message: ' success to get Category successfully', updatedCategory };
   }




}
