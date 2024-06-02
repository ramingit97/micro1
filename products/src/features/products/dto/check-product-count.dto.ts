import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class CheckProductCountDto {
    @IsString()
    @IsNotEmpty()
    id: string;


    @IsString()
    @IsNotEmpty()
    name: string;


    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    count: number;
}
