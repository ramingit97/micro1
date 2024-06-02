import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProviderOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CheckProductCountStep } from './usecases/order/steps/check-product-count.step';
import { CreateOrderSaga } from './usecases/order/order.saga';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Admin, Kafka } from 'kafkajs';
import { MySocketGateway } from './gateways/socker.gateway';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ImageServiceModule } from './modules/image_service/image.service.module';
@Module({
  imports: [  
    HttpModule,
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot({global:true}),
    ClientsModule.register([
      {
        name: 'RESTAURANT_SERVICE', 
        transport: Transport.KAFKA, 
        
        options: {
          client: {
            clientId: 'restaurant',
            brokers: ['kafka-0:9092', 'kafka-1:9092'],
          },
          consumer: {
            groupId: 'restaurant-consumer',
            allowAutoTopicCreation:false
          },
        },
      },
      {
        name: 'RESTAURANT_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          host: 'restaurant-service',
          port: 4000
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 5000
        },
      },
    ],
  ), 
  UsersModule,
  ProductsModule,
  OrdersModule,
  ImageServiceModule
  ],

  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {
  

}