import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokensRepo } from './repo/tokens.repo';

@Module({
  imports:[
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule
  ],
  providers: [
    TokensService,
    TokensRepo
  ],
  exports:[TokensService]
})
export class TokensModule {}
