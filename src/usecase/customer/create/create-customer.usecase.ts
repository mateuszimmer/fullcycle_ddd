import { Customer } from "../../../domain/customer/entity/customer";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputCreateCustomerDTO, OutputCreateCustomerDTO } from "./create-customer.dto";
import { v4 as uuid } from "uuid";

export class CreateCustomerUseCase {

    private repo: CustomerRepositoryInterface;

    constructor(repository: CustomerRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputCreateCustomerDTO): Promise<OutputCreateCustomerDTO> {
        const address = new Address(
            input.address.street,
            input.address.number,
            input.address.city,
            input.address.zipCode,
        )
        const customer = CustomerFactory.createWithAddress(input.name, address);
        customer.validate();

        await this.repo.create(customer);

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                city: customer.address.city,
                zipCode: customer.address.zipCode,
            },
            active: customer.isActive()
        } as OutputCreateCustomerDTO;
    }

}