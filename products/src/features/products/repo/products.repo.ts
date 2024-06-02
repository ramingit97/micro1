import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Inject, Injectable,Scope } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { CheckProductCountDto } from "../dto/check-product-count.dto";
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from "src/common/BaseRepository";

@Injectable()
export class ProductsRepository extends BaseRepository{
    constructor(
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        public dataSource: DataSource,
    ) {
        super(dataSource);
     }

    // async create(product: ProductEntity): Promise<ProductEntity> {
    //     const newProduct = new ProductEntity(product);
    //     return await this.productRepo.save(newProduct)
    // }

  

    async create(product:ProductEntity){
        const newProduct = new ProductEntity(product);
        return await this.saveData(ProductEntity,newProduct);
    }

    async findAll(query = {}): Promise<ProductEntity[]> {
        return await this.productRepo.find(query);
    }


    async findById(id: string): Promise<ProductEntity> {
        return await this.productRepo.findOne({ where: { id } });
    }

    async deleteAll() {
        return await this.productRepo.delete({});
    }

    async removeById(id: string) {
        return await this.productRepo.delete({ id });
    }

    async update(id: string, updateData: Partial<ProductEntity>): Promise<ProductEntity> {
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product) {
            // Handle case where order with provided id doesn't exist
            return null;
        }
        await this.productRepo.update({ id }, updateData);
        return await this.productRepo.findOne({ where: { id } });
    }

    async checkCount(ids) {
        let products = await this.sqlQuery(`
            SELECT R.count, R.name, R.id
            FROM product AS R
        `)
        return products;
    }


    async reduceCount(product: CheckProductCountDto) {
        let res = await this.productRepo.query(
            `UPDATE product SET count = count - $1 WHERE id = $2`,
            [product.count, product.id]
        );
        return res;
    }

    async increaseCount(product: CheckProductCountDto) {
        let res = await this.productRepo.query(
            `UPDATE product SET count = count + $1 WHERE id = $2`,
            [product.count, product.id]
        );
        return res;
    }

    async sqlQuery(query) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        let res = await queryRunner.manager.query(query);

        await queryRunner.release()
        return res;
    }

}