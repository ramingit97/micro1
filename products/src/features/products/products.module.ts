import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './repo/products.repo';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageServiceModule } from '../image_service/image.service.module';

@Module({
  imports: [
    ImageServiceModule, 
    TypeOrmModule.forFeature([ProductEntity])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository, ProductsService]
})
export class ProductsModule {}
