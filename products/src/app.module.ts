import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './features/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSource } from './ormconfig';
import { ImagesModule } from './features/images/images.module';
import { ImageServiceModule } from './features/image_service/image.service.module';

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
    ProductsModule,
    ImagesModule,
    ImageServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
