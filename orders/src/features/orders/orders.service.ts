import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersRepository } from './repo/orders.repo';

@Injectable()
export class OrdersService {

  constructor(
    private readonly orderRepo: OrdersRepository) {
  }


  async create(order: CreateOrderDto): Promise<OrderEntity> {
    const orderEntity = new OrderEntity(order)
    let res = await this.orderRepo.create(orderEntity);
    return res;
  }

  async findAll(): Promise<OrderEntity[]> {
    let res = await this.orderRepo.findAll();
    return res;
  }

  async findOne(id: string): Promise<OrderEntity> {
    let res = await this.orderRepo.findOne(id);
    
    if (!res) {
      // Handle case where order with provided id doesn't exist
      throw new HttpException({message:"order_not_found"},HttpStatus.NOT_FOUND)
  }
    return res;
  }

  update(id: string, updateData: UpdateOrderDto): Promise<OrderEntity> {
    let res = this.orderRepo.update(id, updateData);
    return res;
  }

  remove() {
    let res = this.orderRepo.deleteAll();
    return res;
  }

  removeById(id: string) {
    let res = this.orderRepo.removeById(id);
    return res;
  }



  async complete(id:string){
    let order = await this.findOne(id);
    const orderEntity = new OrderEntity(order);
    orderEntity.complete()
    return this.orderRepo.update(id,orderEntity);
  }

  async cancel(id:string){
    let order = await this.findOne(id);
    const orderEntity = new OrderEntity(order);
    orderEntity.cancel()
    return this.orderRepo.update(id,orderEntity);
  }
}
