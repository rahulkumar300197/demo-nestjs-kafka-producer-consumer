import { DynamicModule, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientService } from './kafka.client.service';

@Global()
export class KafkaClientModule {
  static forRoot(): DynamicModule {
    return {
      module: KafkaClientModule,
      imports: [
        ClientsModule.register([
          {
            name: 'CLIENT_KAFKA',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'PRODUCER_CLIENT',
                brokers: [process.env.KAFKA_BROKER],
              },
              consumer: {
                groupId: 'PRODUCER_2_GROUP',
              },
            },
          },
        ]),
      ],
      providers: [KafkaClientService],
      exports: [KafkaClientService],
    };
  }
}
