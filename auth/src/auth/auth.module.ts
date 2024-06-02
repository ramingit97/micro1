import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
        TokensModule,
        UsersModule,
        JwtModule
    ],
    providers: [
        AuthService
    ],
    exports: [JwtModule, TokensModule, UsersModule],
    controllers: [AuthController]
})
export class AuthModule { }