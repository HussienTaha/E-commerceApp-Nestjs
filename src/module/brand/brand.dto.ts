import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
 
 export class CreateBrandDto{
    
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    name :string;


    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    slogan :string;
  }