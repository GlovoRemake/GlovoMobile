import {ICartAdditional} from "@/types/Cart/ICartAdditional";

export interface ICartAdditionalGroup {
    id: number;
    name: string;
    minChoice: number;
    maxChoice: number;
    order: number;
    additionals: ICartAdditional[];
}