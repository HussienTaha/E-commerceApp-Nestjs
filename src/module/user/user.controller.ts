import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { confermEmailDto, loginDto, resedOtpDto, signupDto } from './DTO/user.dto';
import  type{ userRequst } from 'src/common/interfaces';
import {  AuthenticationGuard } from 'src/common/guards';
import { Roles, Token, TokenType, User, USER_ROLE } from 'src/common';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import type { HUserDocument } from 'src/DB';

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
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
   @Get('/profile')
  profile( @User() user: HUserDocument) {

    return({message:"profile",user})
    // return this.userService.profile();
  }

}
