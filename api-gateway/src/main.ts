import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllRpcExceptionsFilter } from './exception-filters/rpc.filter';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api"); 
  app.enableCors({
    credentials:true,
    origin:[
      'http://localhost:3001',
    ]
  })

  app.use(cookieParser())

  app.useGlobalFilters(new AllRpcExceptionsFilter())
  await app.listen(3000,()=>{
    console.log("API GATEWAY IS RUNNING ON PORT =>   ", 3000) 
  });
}
bootstrap();
