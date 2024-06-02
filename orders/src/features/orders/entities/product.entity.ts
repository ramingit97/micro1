import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToMany } from 'typeorm'
import { v4 as uuidv4 } from 'uuid';
import { OrderEntity } from './order.entity';
import { IProduct } from '../interfaces/product.interface';



@Entity('product')
export class ProductEntity implements IProduct {

    // @PrimaryGeneratedColumn()
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    count: number

    @Column()
    productId: string


    @ManyToMany(() => OrderEntity, (order) => order.products)
    orders: OrderEntity[]



    constructor(product: Partial<IProduct>) {
        if (product) {
            product.productId = product.id;
            product.id = uuidv4();
            Object.assign(this, product)
        }
    }

}