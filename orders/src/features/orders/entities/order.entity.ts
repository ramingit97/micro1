import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToMany, JoinTable,Generated } from 'typeorm'
import { IOrder } from '../interfaces/order.interface';
import { v4 as uuidv4 } from 'uuid';
import { ORDER_STATUS } from '../utils/constants';
import { ProductEntity } from './product.entity';



@Entity('order')
export class OrderEntity implements IOrder {

    // @PrimaryGeneratedColumn()
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    number: string;

    @Column()
    number2: string;


    @Column({})
    @Generated('increment')
    sequence: number;


    @Column()
    status: ORDER_STATUS = ORDER_STATUS.PROGRESS


    @ManyToMany(() => ProductEntity, (product) => product.orders, {
        cascade: true,
    })
    @JoinTable()
    products: ProductEntity[]


    @Column({
        nullable:true,
        default:null
    })
    userId: number;

    constructor(order: Partial<IOrder>) {
        if (order) {
            if (!order.id) {
                order.id = uuidv4();
            }
            Object.assign(this, order)
        }
    }

    complete(){
        this.status = ORDER_STATUS.ACCEPTED;
    }

    cancel(){
        this.status = ORDER_STATUS.REJECTED;
    }

}