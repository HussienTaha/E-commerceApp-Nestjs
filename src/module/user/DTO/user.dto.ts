
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Length, Matches, Max, max, Min, MinLength, ValidateIf} from "class-validator";

import { IsMatch } from "src/common/Decorator";
import { USER_GENDER } from "src/common/enum";

export class resedOtpDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    @IsString({ message: 'Email must be a string' })
    email: string;
}


export class loginDto extends resedOtpDto{
    
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}

export class confermEmailDto extends resedOtpDto{
    @IsNotEmpty({ message: 'Otp is required' })
    @IsString({ message: 'Otp must be a string' })
    @Matches(/^[0-9]{6}$/, { message: 'Otp must be a 6 number' })
    otp: string;

}
export class signupDto extends  resedOtpDto{
    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @ValidateIf((data:signupDto)=>{
        return Boolean (!data.userName)
    })
    fName: string;



    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @ValidateIf((data:signupDto)=>{
        return Boolean (!data.userName)
    })
    lName: string;


    @Length(3 , 20 ,{ message: 'Name must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @ValidateIf((data:signupDto)=>{
        return Boolean (!data.fName && !data.lName)
    })
userName: string

 

    @IsNotEmpty()
    @IsString()
   @Matches(/^01[0-2,5]{1}[0-9]{8}$/, {
  message: 'Invalid Egyptian phone number',
})
 contact: string;

    @IsNotEmpty()
    @IsString()
    address: string


@IsEnum(USER_GENDER)
@IsOptional()
gender?: USER_GENDER

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
@ValidateIf((data:signupDto)=>{
    return Boolean (data.password)
})
@IsMatch(["password"])
    confirmPassword: string
}
