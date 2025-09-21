import { Customer } from "../../../domain/customer/entity/customer";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { CustomerOutputType, InputListCustomerDTO, OutputListCustomerDTO } from "./list-customer.dto";

export class ListCustomerUseCase {
    private repo: CustomerRepositoryInterface;

    constructor(repository: CustomerRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputListCustomerDTO): Promise<OutputListCustomerDTO> {
        const customerList = await this.repo.findAll();

        return OutputMapper.toOutput(customerList);
    }
}

class OutputMapper {
    static toOutput(customerList: Customer[]): OutputListCustomerDTO {
        const customers: CustomerOutputType[] = customerList.map(customer => ({
                    id: customer.getId(),
                    name: customer.name,
                    address: {
                        street: customer.address.street,
                        number: customer.address.number,
                        city: customer.address.city,
                        zipCode: customer.address.zipCode,
                    },
                    active: customer.isActive(),
                } as CustomerOutputType))
        
        return {
            customers
        }
    }
}