export interface InputListCustomerDTO {}

export type CustomerOutputType = {
    id: string;
    name: string;
    address: {
        street: string;
        number: number;
        city: string;
        zipCode: string;
    }
    active: boolean;
}

export interface OutputListCustomerDTO {
    customers: CustomerOutputType[];
}