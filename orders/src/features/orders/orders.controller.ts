import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('orders') 
  async create(@Payload() order: CreateOrderDto,@Ctx() context:KafkaContext) {    
    const { offset } = context.getMessage();
        const partition = context.getPartition();
        const topic = context.getTopic();

    let res = await this.ordersService.create(order)
    context.getConsumer().commitOffsets([
      { topic, partition, offset: (Number(offset) + 1).toString()  }
    ])
    return {...res,isValid:true};
  }


  @MessagePattern('order_list')  
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('order_find',Transport.TCP)
  findOne(@Payload() id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('order_complete',Transport.TCP)
  complete(@Payload() id:  string) {

    // throw new HttpException({message:"ERRORU IMITASIYA EDIRIK"},HttpStatus.AMBIGUOUS)
    return this.ordersService.complete(id);    
  } 
  // @MessagePattern('order_cancel')
  // cancel(@Payload() id:  string) {
  //   return this.ordersService.cancel(id);    
  // }

  @MessagePattern('order_remove_all',Transport.TCP)
  remove_all(@Payload() id: string) {
    return this.ordersService.remove();
  }
  // @MessagePattern('order/remove',Transport.TCP)
  // remove(@Payload() id: string) {
  //   return this.ordersService.removeById(id);
  // }
}
