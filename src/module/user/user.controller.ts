import  {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post, 
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  confermEmailDto,
  forgetPasswordDto,
  loginDto,
  resedOtpDto,
  resetPasswordDto,
  signupDto,
  updateUser,
} from './DTO/user.dto';
import { AuthenticationGuard } from 'src/common/guards';
import { Roles, Token, TokenType, UserDecorator, USER_ROLE, TokenDecorator,  } from 'src/common';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import type { HRevokedTokenDocument, HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';


import { multerCloud } from 'src/common/utils/multer';
import { FILE_TYPES } from 'src/common/fileType';
import { IdDto } from '../brand/brand.dto';

@Controller('users')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    // stopAtFirstError: true
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}
  //  new ZodValidationPipe(userValidation) دي لو هنستخدم zod بتكون كده علي الكونترولر
  @Post('/signup')
  signup(@Body() Body: signupDto) {
    return this.userService.signup(Body);
  }
  @Post('/resedOtp')
  resedOtp(@Body() Body: resedOtpDto) {
    return this.userService.resedOtp(Body);
  }
  @Patch('/confermEmail')
  confermEmail(@Body() Body: confermEmailDto) {
    return this.userService.confermEmail(Body);
  }

  @Post('/login')
  login(@Body() Body: loginDto) {
    return this.userService.login(Body);
  }

  // @SetMetadata("tokentype",TokenType.access)
  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Get('/profile')
  profile(@UserDecorator() user: HUserDocument) {
    return { message: 'profile', user };
    // return this.userService.profile();
  }

    @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/forgetPassword')
 async forgetPassword( @Body() Body: forgetPasswordDto,  @UserDecorator() user: HUserDocument) {
    await this.userService.forgetPassword(Body);
    return { message: '  otp send successfully '};
    // return this.userService.profile();
  }

      @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/resetPassword')
 async resetPassword( @Body() Body: resetPasswordDto,  @UserDecorator() user: HUserDocument) {
    await this.userService.resetPassword(Body);
    return { message: '   password  reset successfully '};
    // return this.userService.profile();
  }

 @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  async uploadFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File , @UserDecorator() usre: HUserDocument) {
   const url = await this.userService.uploadFile(file, usre);
    return {message:"file uploded sucssesfuly", url};
  }

  
      @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/logout')
 async logout(  @TokenDecorator() user: HRevokedTokenDocument, @UserDecorator() userr: HUserDocument) {
    await this.userService.logout(user, userr);
    return { message: 'logout successfully 😎😎 '};
    // return this.userService.profile();
   
 }




     @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/updateUser/:id')
 async updateUser( @Param() params: IdDto,  @Body() Body: updateUser, @TokenDecorator() @UserDecorator() user: HUserDocument) {
  const updates=  await this.userService.updateUser( params.id,Body,user);
    return { message: 'logout successfully 😎😎 ',updates };
    // return this.userService.profile();
   
 }



 @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('uploadFileimage/:id')
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({
        fileTypes: Object.values(FILE_TYPES.IMAGES),
      }),
    ),
  )
  async uploadFileimage(  @Param() params: IdDto,   @UploadedFile(new ParseFilePipe()) file: Express.Multer.File , @UserDecorator() usre: HUserDocument) {
   const url = await this.userService.uploadFileimage( params.id ,file, usre);
    return {message:"file uploded sucssesfuly", url};
  }
 
 @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/freezeUser')
  freezeUser(@UserDecorator() user: HUserDocument) {
    this.userService.freezeUser(user);
    return { message: 'User updated successfully 👌😊' };
  
  }

 @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/unFreezeUser')
  unFreezeUser(@UserDecorator() user: HUserDocument) {
    this.userService.unFreezeUser(user);
    return { message: 'User updated successfully 👌😊' };
  
  }

}
