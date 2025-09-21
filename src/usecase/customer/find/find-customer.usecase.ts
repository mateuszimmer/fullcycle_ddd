import { Customer } from "../../../domain/customer/entity/customer";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { InputFindCustomerDTO, OutputFindCustomerDTO } from "./find-customer.dto";

export class FindCustomerUseCase {

    private repo: CustomerRepositoryInterface;

    constructor(repository: CustomerRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputFindCustomerDTO): Promise<OutputFindCustomerDTO> {
        const customerEntity: Customer = await this.repo.findById(input.id);

        return {
            id: customerEntity.getId(),
            name: customerEntity.name,
            address: {
                street: customerEntity.address.street,
                number: customerEntity.address.number,
                city: customerEntity.address.city,
                zipCode: customerEntity.address.zipCode,
            },
            active: customerEntity.isActive(),
        } as OutputFindCustomerDTO;
    }
}