import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type CheckoutDocument = HydratedDocument<Checkout>
@Schema()
export class Checkout {

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Cart' })
    cartId: string

    @Prop()
    shop_order: Array<Record<string, any>>
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout)
CheckoutSchema.set('timestamps', true);
