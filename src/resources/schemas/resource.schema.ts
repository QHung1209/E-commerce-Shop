import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type ResourceDocument = HydratedDocument<Resource>
@Schema()
export class Resource {
    @Prop({ required: true })
    name: string
    @Prop({ default: '' })
    description: string
}
export const ResourceSchema = SchemaFactory.createForClass(Resource)
