import { Customer } from "../../../domain/customer/entity/customer";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputFindCustomerDTO, OutputFindCustomerDTO } from "./find-customer.dto";
import { FindCustomerUseCase } from "./find-customer.usecase";

describe('Find Customer Unit Tests', () => {
    const mockRepo: jest.Mocked<CustomerRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn()
    };
    test('Should find a customer', async () => {
        const customer = new Customer('1', 'John Wick');
        const customerAddress = new Address('Wall St', 123, 'New York', '11234');
        customer.changeAddress(customerAddress);

        mockRepo.findById.mockReturnValue(Promise.resolve(customer));
        const findByIdSpy = jest.spyOn(mockRepo, 'findById');
        
        const useCase = new FindCustomerUseCase(mockRepo);

        const customerDto = await useCase.execute({ id: '1' } as InputFindCustomerDTO);

        expect(customerDto).toStrictEqual({
            id: customer.getId(),
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                city: customer.address.city,
                zipCode: customer.address.zipCode
            },
            active: customer.isActive(),
        } as OutputFindCustomerDTO)

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('1');
    });

    test('Should throw error if not find a customer', async () => {
        mockRepo.findById.mockImplementation(() => {
            throw new Error('Customer not found');
        });
        const findByIdSpy = jest.spyOn(mockRepo, 'findById');
        
        const useCase = new FindCustomerUseCase(mockRepo);

        await expect(useCase.execute({ id: '1' } as InputFindCustomerDTO))
                .rejects
                .toThrow(new Error('Customer not found'));

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('1');
    });
});