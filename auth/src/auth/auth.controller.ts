import { Body, Controller, Inject, Post, Get, Req, UsePipes, ValidationPipe, Delete, ParseIntPipe, Param, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { IToken } from 'src/tokens/interfaces/tokens.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IUserToken } from './interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
@Controller('')
export class AuthController {

  constructor(private readonly authService: AuthService,
    private jwtService:JwtService,
    private usersService:UsersService,
    private config:ConfigService,
    private tokenService:TokensService) {

  }



  @MessagePattern("auth/register")
  @UsePipes(ValidationPipe)
  async register(@Payload() user: RegisterUserDto) {
    const result = await this.authService.register(user)
    // await this.authService.setRefreshCookie(result.refresh_token, res)
    return result
  }



  @MessagePattern('auth/login')
  @UsePipes(ValidationPipe)
  async login(@Body() user: LoginUserDto) {
    console.log("user",user);
    const result: IUserToken = await this.authService.login(user);
    // await this.authService.setRefreshCookie(tokens.refresh_token, res)
    return result
  }


  @MessagePattern('token_decode')
  async decode_token(@Payload() tokens:any){
    let token = tokens.access_token;
    let refresh_token = tokens.refresh_token;
    if(!token || !refresh_token){
        throw new UnauthorizedException()
      }
      try{
        console.log('this.config.get<string>("JWT_ACCESS_SECRET")',this.config.get<string>("JWT_ACCESS_SECRET"));
        
        // 1) Нужно проверить есть ли вообще данный токен в базе и не revoke ли он и не закончилось его время
        await this.jwtService.verifyAsync(refresh_token,{
          secret:this.config.get<string>("JWT_REFRESH_SECRET")
        })
  

        let findRefreshToken = await this.tokenService.findToken(refresh_token)
        if(!findRefreshToken){
          throw new UnauthorizedException("")
        }


       
        const payload = await this.jwtService.verifyAsync(token,{
          secret:this.config.get<string>("JWT_ACCESS_SECRET")
        })


        let findUserData = await this.usersService.findByUsername(payload.username);
        
        
        return findUserData;
  
      }
      catch(e){
        console.log('errrrrrrr2222',e);
        
        throw new UnauthorizedException({message:"Session expired"})
      }
}


}
