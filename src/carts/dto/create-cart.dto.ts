import { isEmpty, IsNotEmpty } from "class-validator"

export class CreateCartDto {
    state: string

    @IsNotEmpty()
    product: Record<string, any>

    count_product: number

    @IsNotEmpty()
    userId: string
}
