import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/images.entity';
import { ImagesRepository } from './repo/images.repo';
import { ImageService } from './images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity])
  ],
  controllers: [],
  providers: [ImageService, ImagesRepository],
  exports: [ImagesRepository, ImageService]
})
export class ImagesModule {}
