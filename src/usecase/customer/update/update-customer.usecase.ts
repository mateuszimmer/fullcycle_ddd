import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDTO, OutputUpdateCustomerDTO } from "./update-customer.dto";

export class UpdateCustomerUseCase {
    
    private repo: CustomerRepositoryInterface;

    constructor(repository: CustomerRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputUpdateCustomerDTO): Promise<OutputUpdateCustomerDTO> {
        const persistedCustomer = await this.repo.findById(input.id);

        if (!persistedCustomer)
            throw new Error('Customer not found');

        const newAddress = new Address(
            input.address.street, input.address.number, input.address.city, input.address.zipCode
        );

        persistedCustomer.changeName(input.name);
        persistedCustomer.changeAddress(newAddress);

        if (input.active == true)
            persistedCustomer.activate();
        else
            persistedCustomer.deactivate();

        this.repo.update(persistedCustomer);

        return {
            id: persistedCustomer.id,
            name: persistedCustomer.name,
            address: {
                street: persistedCustomer.address.street,
                number: persistedCustomer.address.number,
                city: persistedCustomer.address.city,
                zipCode: persistedCustomer.address.zipCode,
            },
            active: persistedCustomer.isActive(),
        } as OutputUpdateCustomerDTO
    }
}