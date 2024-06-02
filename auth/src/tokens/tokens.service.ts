import { Injectable } from '@nestjs/common';
import { TokensRepo } from './repo/tokens.repo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IToken, ITokenPayload, IUpdateToken } from './interfaces/tokens.interface';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokensService {

    constructor(
        private readonly tokenRepo: TokensRepo,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }


    async generateTokens(payload: ITokenPayload): Promise<IToken> {
        const tokens = {
            access_token: await this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: this.config.get<string>("ACCESS_EXPIRED"),
            }),
            refresh_token: await this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.config.get<string>("REFRESH_EXPIRED"),
            })
        }

        return tokens;
    }

    async saveTokens({ refresh_token, user_id }: IUpdateToken): Promise<TokenEntity> {
        let findToken = await this.tokenRepo.findByUserId(user_id);

        if (findToken) {
            return await this.tokenRepo.update({ user_id, refresh_token })
        }

        let newToken = new TokenEntity({ refresh_token, user_id });
        return this.tokenRepo.save(newToken);
    }

    async findToken(refresh_token:string): Promise<TokenEntity>{
        return this.tokenRepo.findById(refresh_token)
    }

}
