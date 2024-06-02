export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Gender {
    MALE,
    FEMALE
}

export interface IUser {
    id?: number,
    username: string,
    password: string
    gender: Gender,
    role?: Role,
}
