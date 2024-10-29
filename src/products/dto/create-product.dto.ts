import { IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateProductDto {
    @IsNotEmpty()
    product_name: string

    @IsNotEmpty()
    product_thumb: string

    @IsNotEmpty()
    product_price: string

    @IsNotEmpty()
    product_type: string

    @IsNotEmpty()
    product_quantity: string

    @IsNotEmpty()
    attributes: Record<string, any>;
}
