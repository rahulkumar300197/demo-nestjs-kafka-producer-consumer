import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'CONSUMER_CLIENT',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'CONSUMER_CLIENT_GROUP',
        maxWaitTimeInMs: 100,
        sessionTimeout: 120000,
        heartbeatInterval: 3000,
      },
      run: {
        autoCommit: false,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
