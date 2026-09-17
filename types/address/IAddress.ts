export interface IAddress {
    id: number;
    address: string;
    location: string;
    city: {
        id: number;
        name: string;
        region: {
            id: number;
            name: string;
        }
    };
}