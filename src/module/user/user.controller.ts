import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/common/pipes";
import { userValidation } from "./user.validation";
import { UserDto } from "./DTO/user.dto";


@Controller('users')
export class UserController {
     constructor(private readonly userService: UserService) {}
    //  new ZodValidationPipe(userValidation)
@Post()
getUsers(@Body(  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    // stopAtFirstError: true
})) Body: UserDto) {
    return this.userService.getUsers( Body);  
    // return Body
}

}