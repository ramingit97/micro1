import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Request, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ImageService } from '../image_service/image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

@Controller('product')
export class ProductsController {
    constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    private imageService:ImageService
) {
    }

    @Post('create')
    @UseInterceptors(FilesInterceptor('files'))
    async register(@Body() product,@UploadedFiles() files: Array<any>){
        product.count = 2000;  
        product.id = uuidv4();


        console.log('product',product);
        

        // this.imageService.list(files,{productId:product.id}).then(res=>{
        //     console.log('res111111',res);
        // }); 

        const res = await lastValueFrom(this.productService.send("product_create",{
            product,
            files
            }));  
            
            console.log('res',res);
            
        return res;
    }

    @Get('list')
    async getAll(){
        console.log("list11");
        const res = await lastValueFrom(this.productService.send("product_list",{}));        
        return res;
    }

    @Get('images')
    async images(){
        // const res = await this.imageService.list();       
        // return res;
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@Body() data,@UploadedFiles() files: Array<any>) {
        // const res = await this.imageService.list1();
        // return res;
        // const res = await this.imageService.list(files); 
        // return res;   
    //   const res = await lastValueFrom(this.productService.send("product_create",{
    //     data,
    //     files
    //   }));
    //   return res;
    }



}
