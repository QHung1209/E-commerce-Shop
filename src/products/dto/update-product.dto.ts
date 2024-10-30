import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    product_name: string

    product_thumb: string

    product_price: Number

    product_type: string

    product_quantity: Number

    attributes: Record<string, any>;
}
