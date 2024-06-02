import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { IProductCreateDto } from "../interfaces/product.interface";
import { Type } from "class-transformer";


export class CreateOrderDto {
    @IsString()
    @IsOptional()
    id: string;


    @IsString()
    @IsNotEmpty()
    number: string;

    @IsNumber()
    @IsNotEmpty()
    sequence: number;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => IProductCreateDto)
    products: IProductCreateDto[]

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
