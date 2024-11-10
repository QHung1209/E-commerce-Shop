import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type CartDocument = HydratedDocument<Cart>

@Schema()
export class Cart {
    @Prop({ required: true, enum: ['active', 'completed', 'failed', 'pending'], default: 'active' })
    state: string

    @Prop({ default: [] })
    products: Array<Record<string, any>>

    @Prop()
    count_product: number

    @Prop()
    userId: mongoose.Schema.Types.ObjectId

}

export const CartSchema = SchemaFactory.createForClass(Cart)
