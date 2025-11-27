
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, MinLength, ValidateIf} from "class-validator";

import { IsMatch } from "src/common/Decorator";


export class UserDto {
    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;


    @MinLength(6, )
@IsStrongPassword( {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
})
    @IsNotEmpty()
    password: string;

// @Validate(matchFeilds, { message: 'Passwords do not match' })
@ValidateIf((data:UserDto)=>{
    return Boolean (data.password)
})
@IsMatch(["password"])
    confirmPassword: string
}
