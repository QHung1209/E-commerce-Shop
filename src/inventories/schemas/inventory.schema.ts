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
export const InventorySchema = SchemaFactory.createForClass(Inventory)
