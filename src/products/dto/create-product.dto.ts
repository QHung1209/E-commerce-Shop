import { IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateProductDto {
    @IsNotEmpty()
    product_name: string

    @IsNotEmpty()
    product_thumb: string

    @IsNotEmpty()
    product_price: Number

    @IsNotEmpty()
    product_type: string

    @IsNotEmpty()
    product_quantity: Number

    @IsNotEmpty()
    attributes: Record<string, any>;
}
