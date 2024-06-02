import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate } from 'typeorm'
import { Gender, IUser, Role } from '../interfaces/users.interface'
import { genSalt, hash, compare } from 'bcryptjs'
import { TokenEntity } from '../../tokens/entities/token.entity'
import { Exclude } from 'class-transformer'

@Entity('users')
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string


    @Column({ unique: true })
    email: string

    @Exclude()
    @Column({})
    password: string


    @Column({
        type: "enum",
        enum: Gender,
        default: null,
        nullable: true
    })
    gender: Gender


    @Column({
        type: "enum",
        enum: Role,
        default: null,
        nullable: true
    })
    role: Role


    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date



    @OneToMany(() => TokenEntity, token => token.user, { cascade: true })
    tokens: TokenEntity[]


    constructor(user: IUser) {
        if (user) {
            Object.assign(this,user)
            this.role = user.role ?? Role.USER;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async setPassword() {
        const salt = await genSalt(12);
        this.password = await hash(this.password, salt);
    }


    public async validatePassword(password: string) {
        return compare(password, this.password);
    }

}