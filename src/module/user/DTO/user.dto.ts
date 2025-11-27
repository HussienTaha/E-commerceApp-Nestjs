
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, Length, Max, max, Min, MinLength, ValidateIf} from "class-validator";

import { IsMatch } from "src/common/Decorator";


export class UserDto {
    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    fName: string;



    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    lName: string;


    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;

@IsNotEmpty()
    @Min(10)
    @Max(100)
    @IsNumber()
     age : number;
     
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
