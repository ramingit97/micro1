import { UserEntity } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IToken, IUpdateToken } from '../interfaces/tokens.interface';


@Entity('tokens')
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refresh_token: string;

    @Column()
    user_id: number


    @ManyToOne(() => UserEntity, user => user.tokens, {
        onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;


    constructor(data: IUpdateToken) {
        if (data) {
            // this.refresh_token = data.refresh_token;
            // this.user_id = data.user_id;
            Object.assign(this, data);
        }
    }
}
