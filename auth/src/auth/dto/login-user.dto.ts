import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {

    @IsString({message: "Username should be string 1"})
    @IsNotEmpty()
    username: string
    
    @IsString({message: "Password should be string 2"})
    @IsNotEmpty()
    password: string

}
