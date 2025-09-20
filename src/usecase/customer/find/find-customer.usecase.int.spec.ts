import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/customer.model";
import { CustomerRepository } from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import { Customer } from "../../../domain/customer/entity/customer";
import { Address } from "../../../domain/customer/value-object/address";
import { InputFindCustomerDTO, OutputFindCustomerDTO } from "./find-customer.dto";
import { FindCustomerUseCase } from "./find-customer.usecase";

describe('Find Customer Integration Tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('Should find a customer', async () => {
        const customerRepo = new CustomerRepository();
        const useCase = new FindCustomerUseCase(customerRepo);
        
        const customer = new Customer('1', 'John Wick');
        const customerAddress = new Address('Wall St', 123, 'New York', '11234');
        customer.changeAddress(customerAddress);
        await customerRepo.create(customer);

        const repoData = await customerRepo.findAll();

        expect(repoData.length).toBe(1);

        const customerDto = await useCase.execute({ id: '1' } as InputFindCustomerDTO);

        expect(customerDto).toStrictEqual({
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                city: customer.address.city,
                zipCode: customer.address.zipCode
            },
            active: customer.isActive(),
        } as OutputFindCustomerDTO)

    });

});