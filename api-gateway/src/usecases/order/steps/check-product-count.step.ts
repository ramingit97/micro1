import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka, ClientTCP } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Step } from 'src/common/step.interface';


@Injectable()
export class CheckProductCountStep extends Step<void, void> {
    constructor(
        @Inject("PRODUCT_SERVICE")
        private productClient: ClientTCP,
        private eventEmitter: EventEmitter2
    ) {
        super();
        this.name = 'Check Product Count Step';
        this.step = 2
    }

    async invoke(order): Promise<void> {
        const countedProduct = await lastValueFrom(
            this.productClient.send("product_check_count", order.products)
        )

        return countedProduct;
    }

    async rollback(): Promise<any> {
        return Promise.resolve();
    }

}
