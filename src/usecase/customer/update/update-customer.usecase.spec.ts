import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDTO, OutputUpdateCustomerDTO } from "./update-customer.dto";
import { UpdateCustomerUseCase } from "./update-customer.usecase";

describe('Update Customer Usecase Unit Tests', () => {
    const address = new Address('Main St.', 2233, 'Rio de Janeiro', '665544')
    const customer = CustomerFactory.createWithAddress('Batman', address);

    const repo: jest.Mocked<CustomerRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    }
    test('Should update a user', async () => {
        const expectedAddress = new Address('Wosh St.', 111, 'Toronto', '777777');
        const input = {
            id: customer.id,
            name: customer.name,
            address: {
                street: expectedAddress.street,
                number: expectedAddress.number,
                city: expectedAddress.city,
                zipCode: expectedAddress.zipCode,
            },
            active: true
        } as InputUpdateCustomerDTO;

        repo.findById.mockReturnValue(Promise.resolve(customer))

        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateCustomerUseCase(repo);
        const expectedCustomer: OutputUpdateCustomerDTO = await useCase.execute(input);

        expect(expectedCustomer).toMatchObject(input);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('Should throw error if customer not found', async () => {
        const expectedAddress = new Address('Wosh St.', 111, 'Toronto', '777777');
        const input = {
            id: customer.id,
            name: customer.name,
            address: {
                street: expectedAddress.street,
                number: expectedAddress.number,
                city: expectedAddress.city,
                zipCode: expectedAddress.zipCode,
            },
            active: true
        } as InputUpdateCustomerDTO;

        repo.findById.mockImplementation(() => null);

        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateCustomerUseCase(repo);

        await expect(useCase.execute(input)).rejects.toThrow(new Error('Customer not found'));
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).toHaveBeenCalledTimes(0);
    });
});