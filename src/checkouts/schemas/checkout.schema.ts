import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type CheckoutDocument = HydratedDocument<Checkout>
@Schema()
export class Checkout {

    @Prop({ required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId

    @Prop({ required: true, ref: 'Cart' })
    cartId: mongoose.Schema.Types.ObjectId

    @Prop()
    shop_order: Array<Record<string, any>>
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout)
