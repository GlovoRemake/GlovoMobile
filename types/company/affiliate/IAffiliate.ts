export interface IAffiliate {
    id: string;
    phone: string;
    email: string;
    location: {
        region: string;
        location: string;
        address: string;
        postalIndex: string;
    }
}