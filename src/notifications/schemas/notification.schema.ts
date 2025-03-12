import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type NotificationDocument = HydratedDocument<Notification>
@Schema()
export class Notification {
    @Prop({ enum: ['order', 'product', 'promotion'], required: true })
    noti_type: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    senderId: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    receiverId: mongoose.Schema.Types.ObjectId

    @Prop({ required: true })
    content: string

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

export const NotificationSchema = SchemaFactory.createForClass(Notification)
NotificationSchema.set('timestamps', true);
