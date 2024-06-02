import { Module } from '@nestjs/common';
import { ImageService2 } from './image.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ImageService2],
  exports: [ImageService2]
})
export class ImageServiceModule { }
