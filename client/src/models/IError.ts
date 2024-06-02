export interface IServerError{
    message:string;
    status:number;
}

export interface IServerErrorData{
    data:IServerError
}