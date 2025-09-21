import { NotificationError } from "../../../domain/@shared/notification/notification.error";
import { Customer } from "../../../domain/customer/entity/customer";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { Address } from "../../../domain/customer/value-object/address";
import { InputCreateCustomerDTO, OutputCreateCustomerDTO } from "./create-customer.dto";
import { CreateCustomerUseCase } from "./create-customer.usecase";

describe('Create Customer unit tests', () => {
    const mockRepo: jest.Mocked<CustomerRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    }

    test('Should create a Customer', async () => {
        const input: InputCreateCustomerDTO = {
            name: 'Jack Sparrow',
            address: {
                street: 'Number 1 St.',
                number: 222,
                city: 'Montreal',
                zipCode: '555987',
            }
        }

        const createSpy = jest.spyOn(mockRepo, 'create');

        const useCase = new CreateCustomerUseCase(mockRepo);

        const returnedValue = await useCase.execute(input);

        expect(returnedValue).toMatchObject({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                city: input.address.city,
                zipCode: input.address.zipCode,
            },
            active: false,
        } as OutputCreateCustomerDTO);
        
        expect(createSpy).toHaveBeenCalledTimes(1);
    });

    test('Should throw error if try to create a Customer with invalid name', async () => {
        const useCase = new CreateCustomerUseCase(mockRepo);
        const createSpy = jest.spyOn(mockRepo, 'create');

        const input: InputCreateCustomerDTO = {
            name: '',
            address: {
                street: 'Number 1 St.',
                number: 222,
                city: 'Montreal',
                zipCode: '555987',
            }
        }
        await expect(useCase.execute(input)).rejects.toThrow(new NotificationError([{context: 'customer', message: 'name is a required field'}]));
        expect(createSpy).toHaveBeenCalledTimes(0);
    });

    test('Should throw error if try to create a Customer with invalid address street', async () => {
        const useCase = new CreateCustomerUseCase(mockRepo);
        const createSpy = jest.spyOn(mockRepo, 'create');

        const input: InputCreateCustomerDTO = {
            name: 'Jack Sparrow',
            address: {
                street: '',
                number: 222,
                city: 'Montreal',
                zipCode: '555987',
            }
        }
        await expect(useCase.execute(input)).rejects.toThrow(new Error('Street cannot be empty'));
        expect(createSpy).toHaveBeenCalledTimes(0);
    });

    test('Should throw error if try to create a Customer with invalid address number', async () => {
        const useCase = new CreateCustomerUseCase(mockRepo);
        const createSpy = jest.spyOn(mockRepo, 'create');

        const input: InputCreateCustomerDTO = {
            name: 'Jack Sparrow',
            address: {
                street: 'Number 1 St.',
                number: 0,
                city: 'Montreal',
                zipCode: '555987',
            }
        }
        await expect(useCase.execute(input)).rejects.toThrow(new Error('Number must be greater than 0'));
        expect(createSpy).toHaveBeenCalledTimes(0);
    });

    test('Should throw error if try to create a Customer with invalid address city', async () => {
        const useCase = new CreateCustomerUseCase(mockRepo);
        const createSpy = jest.spyOn(mockRepo, 'create');

        const input: InputCreateCustomerDTO = {
            name: 'Jack Sparrow',
            address: {
                street: 'Number 1 St.',
                number: 222,
                city: '',
                zipCode: '555987',
            }
        }
        await expect(useCase.execute(input)).rejects.toThrow(new Error('City cannot be empty'));
        expect(createSpy).toHaveBeenCalledTimes(0);
    });

    test('Should throw error if try to create a Customer with invalid address zipCode', async () => {
        const useCase = new CreateCustomerUseCase(mockRepo);
        const createSpy = jest.spyOn(mockRepo, 'create');

        const input: InputCreateCustomerDTO = {
            name: 'Jack Sparrow',
            address: {
                street: 'Number 1 St.',
                number: 222,
                city: 'Montreal',
                zipCode: '',
            }
        }
        await expect(useCase.execute(input)).rejects.toThrow(new Error('ZipCode cannot be empty'));
        expect(createSpy).toHaveBeenCalledTimes(0);
    });

});