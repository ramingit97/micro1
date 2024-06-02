import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
    BeforeInsert,PrimaryColumn,
    BeforeUpdate } from 'typeorm'
import { IProduct } from '../interfaces/product.interface';
import { v4 as uuidv4 } from 'uuid';
import { ImageEntity } from '../../images/entities/images.entity';



@Entity('product')
export class ProductEntity implements IProduct {

    // @PrimaryGeneratedColumn()
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    count: number

    @OneToMany(type => ImageEntity, file => file.product)
    files?: ImageEntity[];

    // @Column()
    // userId: number;

    constructor(product: Partial<IProduct>) {
        if (product) {
            if (!product.id) {
                product.id = uuidv4();
            }
            Object.assign(this, product)
        }
    }

}