import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './exception-filters/http.filter';


async function bootstrap() {
  const httpApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.TCP,
    options: {
      host: 'product-service',
      port: 7000,
    },
  });

  httpApp.useGlobalFilters(new HttpExceptionFilter())

  await httpApp.listen();

  console.log("PRODUCTS IS RUNNING ON PORT => ", 7000)


}
bootstrap();
