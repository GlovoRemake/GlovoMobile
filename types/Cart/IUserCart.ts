import {ICompany} from "@/types/company/ICompany";
import {ICart} from "@/types/Cart/ICart";

export interface IUserCart {
    company: ICompany;
    carts: ICart[];
}