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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService,  } from './product.service';
import {  CreateProductDto, IdDto, ProductQueryDto, updateProductDto,} from './product.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FILE_TYPES } from 'src/common/fileType';
import { multerCloud } from 'src/common/utils/multer';
import { Types } from 'mongoose';

@Controller('product')
export class productController {
  constructor(private readonly productService: ProductService  ) {}

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 10 },
      ],
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  @Post('/create')
  async createproduct(
    @Body() productDto: CreateProductDto,
    @UserDecorator() user: HUserDocument,
    @UploadedFiles(ParseFilePipe) files:{ mainImage?: Express.Multer.File[]; subImages?: Express.Multer.File[] } ,
  ) {
    const product = await this.productService.createProduct(productDto, user, files);
    return { message: 'product created successfully', product };
  }




  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/update/:id')
  async updateproduct(
    @Param() params: IdDto,
    @Body() updateproductDto: updateProductDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const product = await this.productService.updateProduct( params.id , updateproductDto, user);
    return { message: 'product updated successfully', product };
  }


  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 10 },
      ],
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  @Patch('/updateImage/:id')
  async updateproductImage(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,
     @UploadedFiles(ParseFilePipe) files:{ mainImage?: Express.Multer.File[]; subImages?: Express.Multer.File[] } 
  ) {
    const productImage = await this.productService.updateProductImage( params.id ,user, files);
    return { message: 'product updated successfully', productImage };
  }






  

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/freeze/:id')
  async freezeproduct(
    @Param() params: IdDto,
    @UserDecorator() user: HUserDocument,

  ) {
    const updateproduct = await this.productService.freezeProduct( params.id ,user);
    return { message: 'product freezed successfully', updateproduct };
  }



  
  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Patch('/unFreeze/:id')
   async unFreezeproduct(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updatedProduct = await this.productService.unFreezeproduct( params.id ,user);
     return { message: 'product unFreezed successfully', updatedProduct };
   }

  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Delete('/delete/:id')
   async Deleteproduct(
     @Param() params: IdDto,
     @UserDecorator() user: HUserDocument,
 
   ) {
     const updateproduct = await this.productService.deleteProduct( params.id ,user);
     return { message: 'product deleted successfully', updateproduct };
   }


   
  
  @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/get/:id')
   async getoneproduct(
     @Param() params: IdDto,
 
   ) {
     const getproduct = await this.productService.getProductById(params.id);
     return { message: ' success to get product  ', getproduct };
   }



    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/getall')
   async getAllproduct(

    @Query() query: ProductQueryDto,
   ) {

     const updateproduct = await this.productService.getAllProducts(query);
     return { message: ' success to get product successfully', updateproduct };
   }



    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Post('/addToWishList/:id')
    async addToWishList(
      @Param() params: IdDto,
      @UserDecorator() user: HUserDocument,
    ) {
      const userExist = await this.productService.addToWishList(params.id, user);
      return { message: 'product added to wishlist successfully',user: userExist };
    }
  
  
  
    @Token(TokenType.access)
   @UseGuards(AuthenticationGuard, AuthorizationGuard)
   @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/getWishList')
    async getWishList(
    
      @UserDecorator() user: HUserDocument,
    ) {
      const userExist = await this.productService.getWishList( user);
      return { message: 'product added to wishlist successfully',user: userExist };
    }

  }

