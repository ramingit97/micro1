import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
// import { RpcExceptionFilter } from './exception-filters/all.filter';
// import { HttpExceptionFilter } from './exception-filters/http.filter';

async function bootstrap() {
  const httpApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.TCP,
    options: {
      host: 'order-service',
      port: 8000,
    },
  });

  // httpApp.useGlobalFilters(new HttpExceptionFilter())

  const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `order`,
          brokers: ['kafka-0:9092','kafka-1:9092'],
        },
        consumer: {
          groupId: 'order-consumer',
          allowAutoTopicCreation:false,
          
        },
      },
    },
  );
 

  await appTcp.listen()



  await httpApp.listen();

  console.log("ORDER SERVICE IS RUNNING ON PORT =>  ", 8000)

}
bootstrap();
