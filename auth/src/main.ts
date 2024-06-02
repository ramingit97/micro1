import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './exception-filters/all.filter';
import { HttpExceptionFilter } from './exception-filters/http.filter';

async function bootstrap() {
  const httpApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.TCP,
    options: {
      host: 'auth-service',
      port: 5000,
    },
  });

  httpApp.useGlobalFilters(new HttpExceptionFilter())

  await httpApp.listen();

  console.log("AUTH IS RUNNING ON PORT => ", 5000)


}
bootstrap();
