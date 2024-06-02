import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { CreateOrderSaga } from 'src/usecases/order/order.saga';
import { CheckProductCountStep } from 'src/usecases/order/steps/check-product-count.step';
import { CreateOrderStep } from 'src/usecases/order/steps/create-order.step';
import { ReduceProductCountStep } from 'src/usecases/order/steps/reduce-product-count.step';
import { CompleteOrderStep } from 'src/usecases/order/steps/complete-order.step';
import { MySocketGateway } from 'src/gateways/socker.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'order-service',
          port: 8000
        },
      },
      {
        name: 'ORDER_SERVICE_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order',
            brokers: ['kafka-0:9092', 'kafka-1:9092'],
          },
          // producerOnlyMode:true,
          consumer: {
            groupId: 'order-consumer',
            allowAutoTopicCreation:false
          },
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'product-service',
          port: 7000
        },
      },
      {
        name: 'PRODUCT_SERVICE_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['kafka-0:9092', 'kafka-1:9092'],
          },
          consumer: {
            groupId: 'product-consumer',
            allowAutoTopicCreation:false
          },
        },
      },
    ])
  ],
  controllers: [OrdersController],
  providers: [
    MySocketGateway,
    {
      provide: 'create-order-saga',
      useClass: CreateOrderSaga,
    },
    {
      provide: 'check-product-count-step',
      useClass: CheckProductCountStep,
    },
    {
      provide: 'create-order-step',
      useClass: CreateOrderStep,
    },
    {
      provide: 'reduce-product-count-step',
      useClass: ReduceProductCountStep,
    },
    {
      provide: 'complete-order-step',
      useClass: CompleteOrderStep,
    },
  ],
  exports: [
    // "check-product-count-step",
  ]
})
export class OrdersModule { }
