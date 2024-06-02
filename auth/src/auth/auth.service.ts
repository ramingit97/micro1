import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepo } from '../users/repo/user.repo';
import { UserEntity } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { IUserToken } from './interfaces/auth.interface';
import { IToken } from 'src/tokens/interfaces/tokens.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieOptions, Response } from 'express';



@Injectable()
export class AuthService {

  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly tokenService: TokensService) {

  }

  async register(data: RegisterUserDto): Promise<IUserToken> {

    let foundUser = await this.usersRepo.findUser(data.username);
    if (foundUser) {
      throw new HttpException({ message: "User already exists" }, HttpStatus.FOUND)
    }


    const newUserEntity = new UserEntity(data);

    const newUser = await this.usersRepo.createUser(newUserEntity);

    let tokens: IToken = await this.tokenService.generateTokens({ user_id: newUser.id });

    await this.tokenService.saveTokens({
      user_id: newUser.id,
      refresh_token: tokens.refresh_token
    })

    return {
      user_id: newUser.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    };
  }

  async login({ username, password }: LoginUserDto): Promise<IUserToken> {
    const user: UserEntity = await this.validate({ username, password });

    let tokens: IToken = await this.tokenService.generateTokens({ username, id: user.id })

    await this.tokenService.saveTokens({
      user_id: user.id,
      refresh_token: tokens.refresh_token
    })

    return {
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    };
  }




  async setRefreshCookie(token: string, res: Response) {
    if (!token) {
      throw new HttpException({ message: "Token not found" }, HttpStatus.NOT_FOUND)
    }
    let cookieOptions: CookieOptions = {
      maxAge: 30 * 24 * 60 * 60,// 30 days
      // domain:'/',
      sameSite: 'strict',
      secure: false
    }
    res.cookie("refresh_token", token, cookieOptions)
  }



  private async validate({ username, password }: LoginUserDto): Promise<UserEntity> {
    let user : UserEntity
    user = await this.usersRepo.findUser(username)

    if (!user) {
      throw new HttpException({ message: "User doesn't exists" }, HttpStatus.NOT_FOUND)
    }

    // const userObj = new UserEntity(user);
    const isCorrectPassword = await user.validatePassword(password);
    if (!isCorrectPassword) {
      throw new HttpException({ message: "Email or password not valid" }, HttpStatus.NOT_FOUND)
    }
    
    return user
  }
}
