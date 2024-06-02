import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka, ClientTCP } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Step } from 'src/common/step.interface';


@Injectable()
export class CreateOrderStep extends Step<void, void> {
    constructor(
        @Inject("ORDER_SERVICE_KAFKA")
        private orderClient: ClientKafka,
        @Inject("ORDER_SERVICE")
        private orderClientTcp: ClientTCP,
        private eventEmitter: EventEmitter2
    ) {
        super();
        this.name = 'Create Order Step';
        this.step = 1;
    }

    async invoke(order): Promise<void> {
        const createOrder = await lastValueFrom(
            this.orderClient.send("orders", {
                // topic:"orders",
                key:"create",
                value:order
            })
        )

        this.eventEmitter.emit("orders_create_event", order);

        
        return createOrder;
    }

    async rollback(order): Promise<any> {
        const reducedProduct = await lastValueFrom(
            this.orderClientTcp.send("order_cancel", order.id)
        )

        return reducedProduct;
        
    }


    // async rollback(order): Promise<any> {
    //     console.log("with compenstattion", order);

    //     const createOrder = await lastValueFrom(
    //         this.orderClient.send("orders.cancel", {
    //             id: order.id
    //         })
    //     )
    //     // return createOrder;
    //     return Promise.resolve();
    // }


    async onModuleInit() {
      this.orderClient.subscribeToResponseOf('orders');
      await this.orderClient.connect();
    //   this.orderClient.subscribeToResponseOf('orders.cancel');
    } 
}
