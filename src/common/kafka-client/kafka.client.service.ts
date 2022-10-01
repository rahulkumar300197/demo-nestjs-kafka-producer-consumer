import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaClientService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject('CLIENT_KAFKA') private readonly client: ClientKafka) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.client.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.close();
  }

  emit(topic: string, key: string, value: any): Promise<any> {
    return lastValueFrom(this.client.emit(topic, { key, value }));
  }
}
