import {ICompanyCategory} from "@/types/company/ICompanyCategory";
import {WeightType} from "@/types/company/WeightType";

export interface ICompanyProduct {
    id: number;
    name: string;
    description: string;
    imagePath: string;
    order: number;
    price: number;
    category: ICompanyCategory;
    weight: number;
    weightType: WeightType;
    kcal: number;
}