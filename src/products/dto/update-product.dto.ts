import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    product_name: string

    product_thumb: string

    product_price: string

    product_type: string

    product_quantity: string

    attributes: Record<string, any>;
}
