export interface InputUpdateCustomerDTO {
    id: string;
    name: string;
    address: {
        street: string;
        number: number;
        city: string;
        zipCode: string
    },
    active: boolean;
}

export interface OutputUpdateCustomerDTO {
    id: string;
    name: string;
    address: {
        street: string;
        number: number;
        city: string;
        zipCode: string
    },
    active: boolean;
}