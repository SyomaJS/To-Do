import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ versionKey: false })
export class Task {
    
}






export const TaskSchema = SchemaFactory.createForClass(Task);
