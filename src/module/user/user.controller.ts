import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { confermEmailDto, loginDto, resedOtpDto, signupDto } from './DTO/user.dto';

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

}
