export abstract class Step<T, R> {
    name: string;
    step:number;
    abstract invoke(params: T): Promise<R>;
    abstract rollback(params: T): Promise<R>;
}
