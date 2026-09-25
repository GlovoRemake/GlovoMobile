import {IPaymentMethod} from "@/types/Order/IPaymentMethod";

export interface IConfirmOrder {
    companyId: string;
    locationId: number;
    paymentMethod: IPaymentMethod;
    tipPercent: number
}