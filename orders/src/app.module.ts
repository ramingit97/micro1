import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './features/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSource } from './ormconfig';
import { Admin, Kafka } from 'kafkajs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.development.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => dataSource.options
    }),
    OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'order',
      brokers: ['kafka-0:9092', 'kafka-1:9092'],
    });

    const admin = kafka.admin();

    await admin.connect(); // Подключаемся к административному интерфейсу Kafka

    try {
      let topicExists = await this.topicExists(admin, 'orders');

      if (!topicExists) {
        await this.createTopic(admin, 'orders', 3, 2);
      }

      topicExists = await this.topicExists(admin, 'order_list');

      if (!topicExists) {
        await this.createTopic(admin, 'order_list', 2, 2);
      }

      // console.log('s');
      
      topicExists = await this.topicExists(admin, 'orders.reply');

      if (!topicExists) {
        await this.createTopic(admin, 'orders.reply', 2, 2);
      }
    } catch (error) {
      console.error('Ошибка при создании темы:', error);
    } finally {
      await admin.disconnect(); // Отключаемся от административного интерфейса Kafka
    }
  }

  async topicExists(admin: Admin, topic: string): Promise<boolean> {
    const topicList = await admin.listTopics();
    return topicList.includes(topic);
  }

  async createTopic(admin: Admin, topic: string, numPartitions: number, replicationFactor: number): Promise<void> {
    await admin.createTopics({
      topics: [{
        topic,
        numPartitions,
        replicationFactor,
      }],
    });
  }
}
