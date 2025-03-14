import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>

enum productType {
    Electronic = 'Electronic',
    Clothing = 'Clothing',
    Funiture = 'Funiture'
}

@Schema()
export class Product {
    @Prop({ required: true })
    product_name: string

    @Prop({ required: true })
    product_thumb: string

    @Prop({ required: true })
    product_price: Number

    @Prop({ required: true })
    product_quantity: Number

    @Prop({ required: true })
    product_type: productType

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    shopId: mongoose.Schema.Types.ObjectId

    @Prop({ type: Map, of: String })
    attributes: Record<string, any>;

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

export const ProductSchema = SchemaFactory.createForClass(Product)
