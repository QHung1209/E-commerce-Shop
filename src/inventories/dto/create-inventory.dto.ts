import { IsNotEmpty } from "class-validator"

export class CreateInventoryDto {
    @IsNotEmpty()
    product_id: string

    @IsNotEmpty()
    shop_id: string

    location: String

    @IsNotEmpty()
    stock: Number

    reservations: Array<Record<string, any>>
}
