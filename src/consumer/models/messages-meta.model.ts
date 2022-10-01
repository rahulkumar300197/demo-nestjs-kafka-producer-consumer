import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'messagesmeta', timestamps: true })
export class MessagesMeta {
  @Prop({ required: true })
  messageId: string;

  @Prop()
  messageOffset: string;

  @Prop({ required: true })
  messageMetaData: MongooseSchema.Types.Mixed;
}

export type MessagesMetaDocument = MessagesMeta & Document;

export const MessagesMetaSchema = SchemaFactory.createForClass(MessagesMeta);
