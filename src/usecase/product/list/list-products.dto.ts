export interface InputListProductsDTO {}

export type ProductDTO = {
    id: string;
    name: string;
    price: number;
}

export interface OutputListProductsDTO {
    products: ProductDTO[];
}