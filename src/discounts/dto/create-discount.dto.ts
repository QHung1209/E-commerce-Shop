import mongoose from "mongoose"

export class CreateDiscountDto {
    name: string

    description: string

    type: string

    value: Number

    code: string

    start_date: Date

    end_date: Date

    max_uses: Number

    uses_count: Number

    users_used: Array<mongoose.Schema.Types.ObjectId>

    max_uses_per_user: Number

    min_order_value: Number

    is_active: boolean

    product_type: string

    product_ids: Array<mongoose.Schema.Types.ObjectId>
}
