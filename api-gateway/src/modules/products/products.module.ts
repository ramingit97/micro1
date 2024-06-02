import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ImageServiceModule } from '../image_service/image.service.module';

@Module({
  imports: [
    ImageServiceModule,
    ClientsModule.register([{
    name: 'PRODUCT_SERVICE',
    transport: Transport.TCP,
    options: {
      host:'product-service',
      port:7000
    },
  }])],
  controllers: [ProductsController],
  providers: [],
  exports: []
})
export class ProductsModule { }
