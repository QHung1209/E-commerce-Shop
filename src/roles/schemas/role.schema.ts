import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type RoleDocument = HydratedDocument<Role>
@Schema()
export class Role {
    @Prop({ default: 'user', enum: ['user', 'shop', 'admin'] })
    name: string
    @Prop({ default: 'active', enum: ['active', 'block'] })
    status: string
    @Prop({
        type: [
            {
                resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
                actions: { type: String, required: true }
            }
        ],
        default: []
    })
    grants: {
        resource: string;
        actions: string;
        attributes: string
    }[];


}
export const RoleSchema = SchemaFactory.createForClass(Role)
