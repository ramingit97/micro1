import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class CreateProductDto {
    @IsString()
    @IsOptional()
    id: string;


    @IsString()
    @IsNotEmpty()
    name: string;


    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    count: number;

    @IsString()
    description: string;


    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
