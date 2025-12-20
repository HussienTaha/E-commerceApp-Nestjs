import  {
  Body,
  Controller,
  Get,
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
  loginDto,
  resedOtpDto,
  signupDto,
} from './DTO/user.dto';
import { AuthenticationGuard } from 'src/common/guards';
import { Roles, Token, TokenType, UserDecorator, USER_ROLE,  } from 'src/common';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import type { HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';


import { multerCloud } from 'src/common/utils/multer';
import { FILE_TYPES } from 'src/common/fileType';

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


}
