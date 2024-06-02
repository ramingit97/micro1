import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImageEntity } from './entities/images.entity';
import { ImagesRepository } from './repo/images.repo';


@Injectable()
export class ImageService {

  constructor(
    private readonly productRepo: ImagesRepository) {
  }

  async create(product: any): Promise<ImageEntity> {
    let res = await this.productRepo.create(product);
    return res;
  }

  async findAll(): Promise<ImageEntity[]> {
    let res = await this.productRepo.findAll();
    return res;
  }


}
