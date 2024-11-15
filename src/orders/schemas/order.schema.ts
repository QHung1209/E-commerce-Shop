import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>
@Schema()
export class Order {
    @Prop({ required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId

    @Prop({ required: true, type: Object })
    checkout: Record<string, any>

    @Prop({ required: true })
    address: string

    @Prop({ required: true })
    payment_type: string

    @Prop({ required: true })
    products: Array<Record<string, any>>

    @Prop()
    trackingNumber: string

    @Prop({ enum: ['pending', 'confirmed', 'shipping', 'canceled', 'delivered'], default: 'pending' })
    status: string

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
export const OrderSchema = SchemaFactory.createForClass(Order)
