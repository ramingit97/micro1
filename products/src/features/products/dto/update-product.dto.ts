// import { PartialType } from '@nestjs/mapped-types';
// import { CreateProductDto } from './create-product.dto';

// export class UpdateProductDto extends PartialType(CreateProductDto) {
//   id: string;
// }


import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;


    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    count: number;

    @IsString()
    description: string;
}
