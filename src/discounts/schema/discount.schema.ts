import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type DiscountDocument = HydratedDocument<Discount>
@Schema()
export class Discount {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ enum: ['fixed_amount', 'percentaged'], default: "fixed_amount" }) //percentaged
    type: string

    @Prop({ required: true })
    value: number

    @Prop({ required: true })
    code: string

    @Prop({ required: true })
    start_date: Date

    @Prop({ required: true })
    end_date: Date

    @Prop({ required: true })
    max_uses: number

    @Prop({ required: true })
    uses_count: number

    @Prop()
    users_used: Array<mongoose.Schema.Types.ObjectId>

    @Prop({ required: true })
    max_uses_per_user: number

    @Prop({ required: true })
    min_order_value: number

    @Prop({ required: true, ref: 'User' })
    shop_id: mongoose.Schema.Types.ObjectId

    @Prop({ required: true, default: true })
    is_active: boolean

    @Prop({ enum: ['all', 'specific'], default: 'all' })
    product_type: string

    @Prop()
    product_ids: Array<mongoose.Schema.Types.ObjectId>



    @Prop({ default: Date.now })
    createdAt: Date

    @Prop({ default: Date.now })
    updatedAt: Date

    @Prop()
    deletedAt: Date

    @Prop()
    isDeleted: boolean

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    deleteddBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }
}
export const DiscountSchema = SchemaFactory.createForClass(Discount)
DiscountSchema.set('timestamps', true);
