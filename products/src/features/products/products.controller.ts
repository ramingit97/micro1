import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CheckProductCountDto } from './dto/check-product-count.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  
  @MessagePattern('product_create')
  @UseInterceptors(TransactionInterceptor)
  async create(@Payload() {product}: any) {
    console.log("payload",product);
    return await this.productsService.create(product);
  }

  @MessagePattern('product_list')
  async findAll() {
    return await this.productsService.findAll();
  }

  @MessagePattern('product_find')
  async findOne(@Payload() id: string) {
    return await this.productsService.findOne(id);
  }

  @MessagePattern('product_update')
  async update(@Payload() data: {id: string , product: UpdateProductDto}) {
    return await this.productsService.update(data.id, data.product);    
  }

  @MessagePattern('product_remove')
  async remove(@Payload() id: string) {
    return await this.productsService.removeById(id);
  }

  @MessagePattern('product_check_count')
  async checkCount(@Payload() products: CheckProductCountDto[]) {
    console.log('123123123213',products)
    return await this.productsService.checkCount(products);
  }

  @MessagePattern('product_reduce_count')
  async reduceCount(@Payload() products: CheckProductCountDto[]) {
    return await this.productsService.reduceCount(products);
  }

  @MessagePattern('product_increase_count')
  async increaseCount(@Payload() products: CheckProductCountDto[]) {
    return await this.productsService.increaseCount(products);
  }
}
