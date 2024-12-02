import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' })
    productId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    comment_parentId: string

    @Prop()
    comment_left: number;

    @Prop()
    comment_right: number;

    @Prop()
    content: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.set('timestamps', true);
