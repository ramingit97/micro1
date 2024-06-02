import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, KafkaContext } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RESTAURANT_SERVICE_TCP') private restaurantService: ClientProxy,
    @Inject('RESTAURANT_SERVICE') private restaurantServiceKafka: ClientProxy,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) { }

  @Get('tcp')
  async getHello() {
    let res = await lastValueFrom(
      this.restaurantService.send("get.all.orders", {
        data: {
          test: "ramin",
          id: 1
        }
      })
    );

    return res;

  }



  @Get('kafka')
  async getHello1() {

    this.restaurantServiceKafka.emit("restaurants", {
      topic:"restaurants",
      key:"update",
      data: {
        test: "ramin",
        id: 1
      }
    });


    this.restaurantServiceKafka.emit("restaurants", {
      topic:"restaurants",
      key:"create",
      data: {
        test: "ramin222",
        id: 1
      }
    });

  
  }
}
