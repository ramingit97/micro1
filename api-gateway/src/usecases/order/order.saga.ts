import { Inject, Injectable } from "@nestjs/common";
import { Step } from "src/common/step.interface";
import { CheckProductCountStep } from "./steps/check-product-count.step";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateOrderStep } from "./steps/create-order.step";
import { ReduceProductCountStep } from "./steps/reduce-product-count.step";
import { CompleteOrderStep } from "./steps/complete-order.step";



async function imitation(){
    return new Promise((res,rej)=>{
        setTimeout(() => {
            res("");
        }, 5000);
    })
}

@Injectable()
export class CreateOrderSaga {

    private steps: Step<void, void>[] = [];
    private successfulSteps: Step<void, void>[] = [];


    constructor(
        @Inject("create-order-step") step1: CreateOrderStep,
        @Inject("check-product-count-step") step2: CheckProductCountStep,
        @Inject("reduce-product-count-step") step3: ReduceProductCountStep,
        @Inject("complete-order-step") step4: CompleteOrderStep,
        private eventEmitter: EventEmitter2
    ) {
        this.steps = [step1, step2, step3,step4]
    }


    async execute(order) {

        // imitation of 30 seconds for client order details

        for (let step of this.steps) {
            // console.log('step',step.name);
            try {
                console.log(`Start Step: ${step.name}`);
                await step.invoke(order);
                await imitation();

                console.log(`Step ${step.step} completed`)
                this.eventEmitter.emit("orders_create_event", order,{
                    stepName:step.name,stepNumber:step.step
                });
                this.successfulSteps.unshift(step);
            } catch (error) {
                console.log('erer1111',error);
                // console.log('brat yeri cirmaqlayir ', error);
                // for(let i=0;i<this.successfulSteps.length;i++){
                //     let s = this.successfulSteps[i]
                //     await s.rollback(order);
                // }
                // console.error(`Failed Step: ${step.name} - `, error);
                this.successfulSteps.forEach(async (s) => {
                    // console.log(`Rollbacking: ${s.name} ...`);
                    
                    // await s.rollback(order);
                    console.log(`Rollback step ${s.step}`)

                })
                this.successfulSteps = [];
                break;
            }
        }
        // console.info('Order Creation Transaction ended successfuly');
        // this.eventEmitter.emit("orders.create.event", order);

    }

}