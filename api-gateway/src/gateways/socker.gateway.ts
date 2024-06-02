import { Inject, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Request } from 'express';
import { Server, Socket } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@WebSocketGateway({ cors: { origin: '*' } })
export class MySocketGateway implements OnGatewayConnection,OnGatewayDisconnect {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  private userSocketsMap: Map<string, Socket[]> = new Map();

  @WebSocketServer()
  server: Server;

  socket:Socket;

  @SubscribeMessage('chat')
  handleMessage(dto: any, @ConnectedSocket() client:Socket): string {
    client.emit("chat","salam")
    // this.server.to(this.socket.id).emit("chat","salam bro necesen")
    return 'Hello world!';
  }

   // it will be handled when a client connects to the server
   async handleConnection(socket: Socket) {
    const user = await this.getUserId(socket);
        if(user) {
          const userSockets = this.userSocketsMap.get(user.id) || [];
          this.userSocketsMap.set(user.id, [...userSockets, socket]);
      } else {
        console.log('Authorization header is missing');
    }
  }
  

  async handleDisconnect(socket: Socket) {
    const user = await this.getUserId(socket);
    if (user) {
      const userSockets = this.userSocketsMap.get(user.id) || [];
      const updatedSockets = userSockets.filter((s) => s.id !== socket.id);
      this.userSocketsMap.set(user.id, updatedSockets);
    }
    
  }


  getCurrentSocket(userId:string){
        return this.userSocketsMap.get(userId);
  }

  getUserSockets(userId: string): Socket[] {
    return this.userSocketsMap.get(userId) || [];
  }

  async emitMessage(payload: any, userId: string) {
    const userSockets = this.getUserSockets(userId);


    for (const socket of userSockets) {
      socket.emit("chat", payload);
    }
  }

  private async getUserId(socket:Socket):Promise<{id:string}> | null{
    const authorizationHeader = socket.request.headers['authorization'];
    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(' ')[1]; 
      let user = await this.cacheService.get(accessToken) as {id:string};
      return user;
    }
    return null; 
  }
}
