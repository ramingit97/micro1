import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageServiceModule { }
