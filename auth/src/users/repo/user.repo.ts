import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../../auth/dto/register-user.dto";


@Injectable()
export class UsersRepo {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) { }


    async createUser(user: RegisterUserDto): Promise<UserEntity> {
        return await this.userRepo.save(user);
    }


    async findAll(): Promise<UserEntity[]> {
        const res = await this.userRepo.find({
            relations: ['orders']
        });
        return res;
    }

    async remove(id: number): Promise<UserEntity> {
        let user = await this.userRepo.findOne({ where: { id } });
        let res = await this.userRepo.delete(id)
        console.log(res);

        return user;
    }

    async findUser(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: { username } });
    }

    async findUserById(id: number): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ id });
    }
}