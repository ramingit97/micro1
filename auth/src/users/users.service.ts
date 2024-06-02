import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepo } from './repo/user.repo';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepo: UsersRepo) {

    }

  
    async findAll(): Promise<UserEntity[]> {
      let res = await this.usersRepo.findAll();

      if(!res.length){
        throw new HttpException("message",HttpStatus.NOT_FOUND);
      }
      return res
    }
  
    async findByUsername(username:string): Promise<UserEntity> {
      let res = await this.usersRepo.findUser(username);

      if(!res){
        throw new HttpException("message",HttpStatus.NOT_FOUND);
      }
      return res
    }




}
