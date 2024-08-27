import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CookieOptions, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { Authorization } from 'src/decorators/authorization.decorator';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('user')
export class UsersController {
    constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {
    }

    @Post('register')
    async register(@Body() userData, @Res() response: Response){
        
        // console.log("userData2",userData);
        userData.gender = 1
        const res = await lastValueFrom(this.authService.send("auth/register",userData));
        await this.setRefreshCookie(res.refresh_token, response)
        
        return res;
    }


    @Post('login')
    async login(@Body() userData, @Res() response: Response){
        console.log("userData2",userData);

        const res = await lastValueFrom(this.authService.send("auth/login",userData));
        
        await this.setRefreshCookie(res.refresh_token, response)
        
        return response.status(200).json(res);
    }

    @UseGuards(AuthGuard)
    @Get("me")
    async getMe(@Body() userData,@Request() request){
        return {result:true,user:request.user};
    }



    private async setRefreshCookie(token: string, res: Response) {
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
}
