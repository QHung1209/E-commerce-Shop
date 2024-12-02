import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    _id: string

    @Prop({ required: true })
    user_id: number

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop()
    name: string

    @Prop()
    phone: string

    @Prop()
    age: number

    @Prop()
    address: string

    @Prop({ default: 'User' })
    role: string

    @Prop()
    refreshToken: string

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

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.set('timestamps', true);

