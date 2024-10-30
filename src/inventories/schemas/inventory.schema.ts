import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type InventoryDocument = HydratedDocument<Inventory>

@Schema()
export class Inventory {
    @Prop({ required: true, ref: 'Product' })
    product_id: mongoose.Schema.Types.ObjectId

    @Prop({ required: true, ref: 'User' })
    shop_id: mongoose.Schema.Types.ObjectId

    @Prop({ required: true })
    location: String

    @Prop({ required: true })
    stock: Number

    @Prop({ default: [] })
    reservations: Array<Record<string, any>>

}
export const InventorySchema = SchemaFactory.createForClass(Inventory)
