import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class ImageService {
    constructor(private readonly httpService: HttpService) {

    }
  
    async list(files:any[],metadata:any): Promise<any[]> {
        const formData = new FormData();
        files.forEach((file, index) => { 
            formData.append('files', file.buffer, file.originalname);
        });

         // Добавляем метаданные
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const { data } = await firstValueFrom(
                    this.httpService.post('http://image-service:9003/api/messages/upload', formData, {
                    headers: formData.getHeaders(),
                    }).pipe(
                    catchError((error: AxiosError) => {
                        console.error('Error uploading file to Image Service:', error);
                        throw new Error('An error occurred while uploading the file.');
                    }),
                    ),
                );
                return data;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('File upload failed.');
            }
    }

    async list1(){ 
        try {
            const { data } = await firstValueFrom(
                this.httpService.get('http://image-service:9003/api/messages/presignedUrl', {
               
                }).pipe(
                catchError((error: AxiosError) => {
                    console.error('Error uploading file to Image Service:', error);
                    throw new Error('An error occurred while uploading the file.');
                }),
                ),
            );

            console.log('data',data)
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('File upload failed.');
        }
        
    }
}