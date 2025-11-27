import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./DTO/user.dto";


@Controller('users')
@UsePipes((  new ValidationPipe({whitelist: true,forbidNonWhitelisted: true,
    // stopAtFirstError: true
})))
export class UserController {
     constructor(private readonly userService: UserService) {}
    //  new ZodValidationPipe(userValidation) دي لو هنستخدم zod بتكون كده علي الكونترولر 
@Post()
addUsers(@Body() Body: UserDto) {
    return this.userService.addUsers( Body);  
    // return Body
}

}