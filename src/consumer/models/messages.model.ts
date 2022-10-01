import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'messages', timestamps: true })
export class Messages {
  @Prop({ required: true })
  messageId: string;

  @Prop()
  messageOffset: string;

  @Prop({ required: true })
  messageMetaData: MongooseSchema.Types.Mixed;
}

export type MessagesDocument = Messages & Document;

export const MessagesSchema = SchemaFactory.createForClass(Messages);
