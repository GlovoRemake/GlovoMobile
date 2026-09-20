import {ICompanyProduct} from "@/types/company/ICompanyProduct";
import {ICartAdditionalGroup} from "@/types/Cart/ICartAdditionalGroup";

export interface ICart {
    id: number;
    product: ICompanyProduct
    additionalGroups: ICartAdditionalGroup[];
    count: number;
}