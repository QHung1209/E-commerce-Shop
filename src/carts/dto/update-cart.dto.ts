import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
    @IsNotEmpty()
    product: Record<string, any>

    @IsNotEmpty()
    userId: string

    old_quantity: number

    quantity: number
}
