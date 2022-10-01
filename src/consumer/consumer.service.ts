import { Injectable, Logger } from '@nestjs/common';
import { KafkaClientService } from '../common/kafka-client/kafka.client.service';
import mongoose, { Connection } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Messages, MessagesDocument } from './models/messages.model';
import { MessagesMeta, MessagesMetaDocument } from './models/messages-meta.model';
import { InjectConnection } from '@nestjs/mongoose/dist/common/mongoose.decorators';

@Injectable()
export class ConsumerService {
  private static counter = 0;
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly kafkaClientService: KafkaClientService,
    @InjectModel(Messages.name)
    readonly messagesModel: mongoose.Model<MessagesDocument>,
    @InjectModel(MessagesMeta.name)
    readonly messagesMetaModel: mongoose.Model<MessagesMetaDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
  }

  async processMessage(offset: string, key: string, value: any) {
    ConsumerService.counter++;
    await this.saveData(offset, key, value);
    return await this.kafkaClientService.emit('com.demo.topic2', key, value);
  }

  wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private async saveData(
    offset: string,
    key: string,
    value: any,
  ): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const messageDoc = new this.messagesModel({
        messageId: key,
        messageOffset: offset,
        messageMetaData: value,
      });
      await messageDoc.save({ session });
      if (ConsumerService.counter % 5 === 0) {
        throw new Error('Test Error');
      }
      const messageMetaDoc = new this.messagesMetaModel({
        messageId: key,
        messageOffset: offset,
        messageMetaData: value,
      });
      await messageMetaDoc.save({ session });
      await session.commitTransaction();
    } catch (e) {
      this.logger.error('Error in Mongo Transaction', e);
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
}
