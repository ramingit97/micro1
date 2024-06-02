import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TransformInterceptor } from 'src/common/validate.interceptor';

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    async findAll(): Promise<UserEntity[]> {
      return await this.usersService.findAll();
    }
}
