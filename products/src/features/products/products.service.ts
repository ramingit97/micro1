import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsRepository } from './repo/products.repo';
import { CheckProductCountDto } from './dto/check-product-count.dto';
import { ImageService2 } from '../image_service/image.service';

@Injectable()
export class ProductsService {

  constructor(
    private readonly productRepo: ProductsRepository,
    private readonly imageService2:ImageService2
  ) {
  }


  async create(product: CreateProductDto): Promise<any> {
    let res = await this.productRepo.create(product);
    return res;
    // this.imageService2.list();
    return {};
  }

  async findAll(): Promise<ProductEntity[]> {
    let res = await this.productRepo.findAll();
    return res;
  }

  async findOne(id: string): Promise<ProductEntity> {
    let res = await this.productRepo.findById(id);
    return res;
  }

  async update(id: string, updateData: UpdateProductDto): Promise<ProductEntity> {
    let res = this.productRepo.update(id, updateData);
    return res;
  }

  async removeById(id: string) {
    let res = this.productRepo.removeById(id);
    return res;
  }

  async checkCount(products: CheckProductCountDto[]) {
    let ids = products.map(x => x.id);
    let res = await this.productRepo.checkCount(ids);

    let errorProducts = [];

    for (let i = 0; i < products.length; i++) {
      let pr = products[i];
      let prFromDb = res.find(x => x.id === pr.id && x.count > pr.count);
      if (!prFromDb) {
        errorProducts.push({
          ...prFromDb,
          requestedCount: pr.count
        })
      }
    }

    if (errorProducts.length) {
      throw new HttpException({ message: "insufficient_product_count", data: errorProducts }, HttpStatus.BAD_REQUEST)
    }

    return { isValid: true, message: "Product counts are valid" };
  }


  async reduceCount(products: CheckProductCountDto[]) {
    let clientRes = []
    if (products.length) {
      for (let i = 0; i < products.length; i++) {
        let res = await this.productRepo.reduceCount(products[i]);
        clientRes.push(res);
      }
      if (clientRes.length) {
        return { isValid: true, message: "Product counts are reduced" };
      }
    } else {
      throw new HttpException({ message: "products_are_not_provided" }, HttpStatus.BAD_REQUEST)
    }
  }

  async increaseCount(products: CheckProductCountDto[]) {
    let clientRes = []
    if (products.length) {
      for (let i = 0; i < products.length; i++) {
        let res = await this.productRepo.increaseCount(products[i]);
        clientRes.push(res);
      }
      if (clientRes.length) {
        return { isValid: true, message: "Product counts are increased" };
      }
    } else {
      throw new HttpException({ message: "products_are_not_provided" }, HttpStatus.BAD_REQUEST)
    }
  }
}
