import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/auth.guard';


@Module({
  imports: [
    ClientsModule.register([{
    name: 'AUTH_SERVICE',
    transport: Transport.TCP,
    options: {
      host:'auth-service',
      port:5000
    },
  }])],
  controllers: [UsersController],
  providers: [
    AuthGuard
  ],
  exports: [
    ClientsModule,
    AuthGuard,
  ]
})
export class UsersModule { }
