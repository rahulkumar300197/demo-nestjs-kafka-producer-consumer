import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from './models/messages.model';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { MessagesMeta, MessagesMetaSchema } from './models/messages-meta.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
      { name: MessagesMeta.name, schema: MessagesMetaSchema },
    ]),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
