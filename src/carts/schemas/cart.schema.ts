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

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId

    @Prop()
    createdAt: Date

    @Prop()
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

export const CartSchema = SchemaFactory.createForClass(Cart)
CartSchema.set('timestamps', true);
