import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { CookieOptions, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { Authorization } from 'src/decorators/authorization.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { MySocketGateway } from 'src/gateways/socker.gateway';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrderSaga } from 'src/usecases/order/order.saga';
import { CheckProductCountStep } from 'src/usecases/order/steps/check-product-count.step';
import { v4 as uuidv4 } from 'uuid';


@UseGuards(AuthGuard)
@Controller('order')  
export class OrdersController {
    constructor(
        @Inject('ORDER_SERVICE') private orderService: ClientProxy,
        @Inject('create-order-saga') private saga: CreateOrderSaga,
        private readonly socketGateway:MySocketGateway
    ) { 
    }

    @Post('create')
    async register(@Body() order,@CurrentUser() user) {
        order.id = uuidv4();
        console.log("orderId",order.id)
        order.userId = user.id;
        this.saga.execute(order);
        return order;
    }

    @Get('list')
    async getAll() {
        const res = await lastValueFrom(this.orderService.send("order_list", {}));
        return res;
    }

    @Get('get/:id') 
    async get(@Param("id") id:string) {
        console.log('get order by id',id);
        const res = await lastValueFrom(this.orderService.send("order_find", id));
        return res;
    }

    @Post('delete')
    async delete(){
        const res = await lastValueFrom(this.orderService.send("order_remove_all", {}));
        return res;
    }


    @OnEvent('orders_create_event')
    async createPost5(data,step){
        
        this.socketGateway.emitMessage({
            // status:"completed",
            step,
            ...data
        },data.userId)
    }
}
