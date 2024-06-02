import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { Gender } from "../../users/interfaces/users.interface";

export class RegisterUserDto {

    @IsString({message: "Username should be string 1"})
    @IsNotEmpty()
    username: string
    
    @IsString({message: "Email should be string 1"})
    @IsNotEmpty()
    email: string

    @IsString({message: "Password should be string 2"})
    @IsNotEmpty()
    @Matches(/[a-zA-Z0-9]{6,}/)
    password: string

    @IsEnum(Gender, {message: "Gender can be 0 or 1"})
    @IsNotEmpty()
    gender: Gender 

}
