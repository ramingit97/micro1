import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
@Injectable()
export class ImageService2 {
    constructor(private readonly httpService: HttpService) {

    }
  
async list(): Promise<any[]> {
    console.log('rerere22') 
    const { data } = await firstValueFrom(
    this.httpService.post<any[]>('http://image-service:9000/api/messages/add',{
        salam:"ramin"
    }).pipe(
        catchError((error:AxiosError ) => {
            console.log('erere',error)
        throw 'An error happened!';
        }),
    ),
    );

    console.log('12121212',data)
    return data;
  }
}
