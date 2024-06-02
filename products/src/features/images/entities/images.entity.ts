import { ProductEntity } from '../../products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn,ManyToOne } from 'typeorm'
import { v4 as uuidv4 } from 'uuid';



@Entity('images')
export class ImageEntity{

    @PrimaryColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    size: number;
    
    @Column()
    lastModified: number;

    @Column()
    type: string;


    @ManyToOne(type => ProductEntity, product => product.files)
    product: ProductEntity;

    // @Column()
    // userId: number;

    constructor(data: Partial<any>) {
        if (data) {
            if (!data.id) {
                data.id = uuidv4();
            }
            Object.assign(this, data)
        }
    }

}