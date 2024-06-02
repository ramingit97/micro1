export interface IProduct {
    id: string;
    name: string;
    count: number;
    productId: string;
}

export class IProductCreateDto {
    id: string;
    name: string;
    count: number;
}