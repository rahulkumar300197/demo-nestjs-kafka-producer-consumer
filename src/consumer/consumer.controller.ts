import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import {
  Consumer,
  KafkaMessage,
} from '@nestjs/microservices/external/kafka.interface';
import { ConsumerService } from './consumer.service';
import * as _ from 'lodash';

@Controller('consumer')
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('com.demo.topic1')
  async firstHandler(@Ctx() context: KafkaContext) {
    const consumer: Consumer = context.getConsumer();
    const topic = context.getTopic();
    const partition = context.getPartition();
    const message: KafkaMessage = context.getMessage();
    const offset = message.offset;
    this.logger.debug('topic, partition, offset', { topic, partition, offset });
    try {
      await this.consumerService.processMessage(
        offset,
        _.get<string>(message, 'key'),
        _.get<any>(message, 'value'),
      );
      await consumer.commitOffsets([{ topic, partition, offset }]);
      consumer.pause([{ topic, partitions: [partition] }]);
      await this.consumerService.wait(2000);
      consumer.resume([{ topic, partitions: [partition] }]);
    } catch (e) {
      this.logger.error('Error In Consumer', e);
      consumer.pause([{ topic, partitions: [partition] }]);
      await this.consumerService.wait(20000);
      consumer.resume([{ topic, partitions: [partition] }]);
      throw e;
    }
  }
}
