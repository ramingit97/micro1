import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ImageEntity } from "../entities/images.entity";

@Injectable()
export class ImagesRepository {
    constructor(
        @InjectRepository(ImageEntity) private repo: Repository<ImageEntity>,
        private dataSource: DataSource
    ) { }

    async create(image: ImageEntity): Promise<ImageEntity> {
        const newProduct = new ImageEntity(image);
        return await this.repo.save(newProduct)
    }

    async findAll(query = {}): Promise<ImageEntity[]> {
        return await this.repo.find(query);
    }

}