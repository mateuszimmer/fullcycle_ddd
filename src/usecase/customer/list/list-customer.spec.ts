import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputListCustomerDTO } from "./list-customer.dto";
import { ListCustomerUseCase } from "./list-customer.usecase";

describe('List customer unit test', () => {

    const customer1 = CustomerFactory.createWithAddress(
        'John Wick',
        new Address('Main St.', 111, 'Porto', '99999')
    );

    const customer2 = CustomerFactory.createWithAddress(
        'Leonardo Da Vinci',
        new Address('Tower St.', 55, 'Paris', '77564')
    );

    const repo: jest.Mocked<CustomerRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    }

    test('Should return a list of customer', async () => {
        repo.findAll.mockReturnValue(Promise.resolve([customer1, customer2]));
        const findAllSpy = jest.spyOn(repo, 'findAll');

        const useCase = new ListCustomerUseCase(repo);

        const input: InputListCustomerDTO = {};

        const output = await useCase.execute(input);

        expect(output.customers.length).toBe(2);
        expect(output.customers[0]).toStrictEqual({
            id: customer1.getId(),
            name: customer1.name,
            address: {
                street: customer1.address.street,
                number: customer1.address.number,
                city: customer1.address.city,
                zipCode: customer1.address.zipCode,
            },
            active: customer1.isActive(),
        })
        expect(output.customers[1]).toStrictEqual({
            id: customer2.getId(),
            name: customer2.name,
            address: {
                street: customer2.address.street,
                number: customer2.address.number,
                city: customer2.address.city,
                zipCode: customer2.address.zipCode,
            },
            active: customer2.isActive(),
        })
        expect(findAllSpy).toHaveBeenCalledTimes(1);
    });
});