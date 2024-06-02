import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientTCP } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Step } from 'src/common/step.interface';


@Injectable()
export class CompleteOrderStep extends Step<void, void> {
    constructor(
        @Inject("ORDER_SERVICE")
        private orderClient: ClientTCP
    ) {
        super();
        this.name = 'Complete Order Step';
        this.step = 4;
    }

    async invoke(order): Promise<void> {
        const reducedProduct = await lastValueFrom(
            this.orderClient.send("order_complete", order.id)
        )
        // console.log(reducedProduct);

        return reducedProduct;
    }

    async rollback(): Promise<any> {
        return Promise.resolve();
    }
}
