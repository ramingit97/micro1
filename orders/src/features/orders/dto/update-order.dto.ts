import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class UpdateOrderDto {
    @IsString()
    @IsNotEmpty()
    number: string;

}
