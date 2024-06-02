import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { OrderEntity } from "../entities/order.entity";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
        private dataSource: DataSource
    ) { }

    async create(order: OrderEntity) {
        // const newOrder = new OrderEntity(order);
        // return await this.orderRepo.save(newOrder)

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let products = [];
            for (let i = 0; i < order.products.length; i++) {
                const newProduct = new ProductEntity(order.products[i]);
                products.push(newProduct);
            }
            await queryRunner.manager.save(ProductEntity, products);
            order.products = products;
            let res = await queryRunner.manager.save(OrderEntity, order);
            await queryRunner.commitTransaction();
            return res;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

    }

    async findAll(): Promise<OrderEntity[]> {
        return await this.orderRepo.find({
            relations: {
                products: true,
            }
        });
    }

    async findOne(id:string){
        const order = await this.orderRepo.findOne({ where: { id } });
        return order;
    }


    async findById(id: string): Promise<OrderEntity> {
        console.log('sql islemeye hazirlasiyor');
        
        // let orders = await this.sqlQuery(`
        //     SELECT * FROM order as ORD
        //     WHERE ORD.id='${id}' 
        //     LEFT JOIN product as PRD
        //     ON ORD.id = PRD.productId
        // `)
        // console.log('sql islediiiiiiii: ', orders);

        let orders = await this.sqlQuery(`
        select * from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'
        `)

        let orders2 = await this.sqlQuery(`
            SELECT * FROM order_products_product
        `)

        let orders3 = await this.sqlQuery(`
            SELECT * FROM "order" AS O 
            LEFT JOIN order_products_product AS OP ON O.id = OP."orderId"
            LEFT JOIN product AS p on p.id = OP."productId"
            WHERE O.id='${id}'
        `)

        // console.log('orders2',orders2)
        // console.log('orders3',orders3)
        
        return orders;
    }

    async deleteAll() {
        return await this.orderRepo.delete({});
    }

    async removeById(id: string) {
        return await this.orderRepo.delete({ id });
    }

    async update(id: string, updateData: Partial<OrderEntity>): Promise<OrderEntity> {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) {
            // Handle case where order with provided id doesn't exist
            return null;
        }
        await this.orderRepo.update({ id }, updateData);
        return await this.orderRepo.findOne({ where: { id } });
    }


    async sqlQuery(query) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        let res = await queryRunner.manager.query(query);

        await queryRunner.release()
        return res;
    }

}