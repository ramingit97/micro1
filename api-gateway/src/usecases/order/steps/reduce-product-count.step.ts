import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientTCP } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Step } from 'src/common/step.interface';


@Injectable()
export class ReduceProductCountStep extends Step<void, void> {
    constructor(
        @Inject("PRODUCT_SERVICE")
        private productClient: ClientTCP
    ) {
        super();
        this.name = 'Reduce Product Count Step';
        this.step = 3;
    }

    async invoke(order): Promise<void> {
        const reducedProduct = await lastValueFrom(
            this.productClient.send("product_reduce_count", order.products)
        )

        return reducedProduct;
    }

    async rollback(order): Promise<any> {
        const reducedProduct = await lastValueFrom(
            this.productClient.send("product_increase_count", order.products)
        )
        return reducedProduct;
    }

}
