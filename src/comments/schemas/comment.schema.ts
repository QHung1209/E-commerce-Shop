import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
    @Prop({ required: true, ref: 'Product' })
    productId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ ref: 'Comment' })
    comment_parentId: mongoose.Schema.Types.ObjectId;

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
