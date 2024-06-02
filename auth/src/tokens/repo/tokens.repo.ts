import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TokenEntity } from "../entities/token.entity";
import { IUpdateToken } from "../interfaces/tokens.interface";



@Injectable()
export class TokensRepo {
    constructor(
        @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>
    ) { }


    async findByUserId(user_id: number): Promise<TokenEntity> {
        return await this.tokenRepo.findOne({ where: { user_id } });
    }

    async findById(refresh_token: string): Promise<TokenEntity> {
        return await this.tokenRepo.findOne({ where: { refresh_token } });
    }


    async update({ user_id, refresh_token }: IUpdateToken) {
        await this.tokenRepo.update({ user_id }, { refresh_token });
        return await this.findByUserId(user_id)
    }


    async save(data: IUpdateToken): Promise<TokenEntity> {
        return await this.tokenRepo.save(data);
    }

}