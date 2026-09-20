export interface IProductAdditional {
    id: number;
    name: string;
    minChoice: number;
    maxChoice: number;
    order: number;
    productId: number;
    additionals: [
        {
            id: number;
            name: string;
            price: number;
            order: number;
        }
    ]
}