import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "./customer.model";
import { CustomerRepository } from "./customer.repository";
import { Address } from "../../../../domain/customer/value-object/address";
import { Customer } from "../../../../domain/customer/entity/customer";


describe('Customer Repository Tests', () => {

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

    test('should create a customer', async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer: Customer = new Customer('1', 'John Doe');
        customer.Address = address;
        
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

        expect(customerModel).not.toBeNull();
        
        expect(customerModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'John Doe',
            street: '123 Main St',
            number: '456',
            city: 'Springfield',
            zipCode: '12345',
            active: false,
            rewardPoints: 0
        })
    });
    
    test('should update a customer', async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer: Customer = new Customer('1', 'John Doe');
        customer.Address = address;
        
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: '1' } });

        expect(customerModel).not.toBeNull();
        
        expect(customerModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'John Doe',
            street: '123 Main St',
            number: '456',
            city: 'Springfield',
            zipCode: '12345',
            active: false,
            rewardPoints: 0
        });

        const updatedCustomer = new Customer('1', 'John Doe Updated');
        updatedCustomer.Address = new Address('123 Main St', 456, 'Springfield Donuts', '12345');

        await customerRepository.update(updatedCustomer);

        const updatedCustomerModel = await CustomerModel.findOne({ where: { id: '1' } });

        expect(updatedCustomerModel.name).toBe('John Doe Updated');
    });

    test('should throw error if customer is not found', async () => {
        const customerRepository = new CustomerRepository();
        await expect(async () => customerRepository.findById('225558'))
            .rejects
            .toThrow('Customer not found');
    });
    
    test('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer: Customer = new Customer('1', 'John Doe');
        customer.Address = address;
        
        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.findById('1');
        expect(foundCustomer).toEqual(customer);
    });

    test('should return all customer', async () => {
        const customerRepository = new CustomerRepository();
        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer: Customer = new Customer('1', 'John Doe');
        customer.Address = address;
        customer.activate();
        
        await customerRepository.create(customer);

        const customer2 = new Customer('2', 'Jane Doe');
        const address2 = new Address('456 Elm St', 789, 'Shelbyville', '67890');
        customer2.Address = address2;
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();
        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);
    });

})