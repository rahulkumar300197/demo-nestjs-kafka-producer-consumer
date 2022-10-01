import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumerModule } from './consumer/consumer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaClientModule } from './common/kafka-client/kafka.client.module';

@Module({
  imports: [
    KafkaClientModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
