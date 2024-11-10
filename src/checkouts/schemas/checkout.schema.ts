import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type CheckoutDocument = HydratedDocument<Checkout>
@Schema()
export class Checkout {

    @Prop()
    userId: mongoose.Schema.Types.ObjectId

    @Prop()
    cartId: mongoose.Schema.Types.ObjectId

    @Prop()
    shop_order: Array<Record<string, any>>
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout)
