import { Sequelize } from "sequelize-typescript";
import { CustomerRepository } from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import { Customer } from "../entity/customer";
import { Address } from "../value-object/address";
import { CustomerCreatedEvent } from "./customer-created.event";
import { ConsoleLog1WhenCustomerIsCreatedEventListener } from "./listeners/console-log-1-when-customer-is-created.listener";
import { ConsoleLog2WhenCustomerIsCreatedEventListener } from "./listeners/console-log-2-when-customer-is-created.listener";
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/customer.model";
import { ConsoleLogWhenCustomerAddressIsChanged } from "./listeners/console-log-when-customer-address-is-changed";

describe('Customer Events Tests', () => {
    let sequelize: Sequelize;
    let customerRepository: CustomerRepository;
    let eventDispatcher: EventDispatcher;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();

        customerRepository = new CustomerRepository();
        eventDispatcher = new EventDispatcher();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('Should send console.log to customer created Event', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const listener1 = new ConsoleLog1WhenCustomerIsCreatedEventListener();
        const listener2 = new ConsoleLog2WhenCustomerIsCreatedEventListener();
        
        eventDispatcher.register('CustomerCreatedEvent', listener1);
        eventDispatcher.register('CustomerCreatedEvent', listener2);
        
        const handleSpy1 = jest.spyOn(listener1, 'handle');
        const handleSpy2 = jest.spyOn(listener2, 'handle');

        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer = Customer.create('1', 'John Doe');
        customer.Address = address;

        await customerRepository.create(customer);

        const events = customer.getEvents();
        events.forEach(event => {
            eventDispatcher.notify(event);
        });

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
        expect(consoleLogSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
        expect(events.size).toBe(1);
        expect([ ...events ][0]).toBeInstanceOf(CustomerCreatedEvent);

        const customerModel = await CustomerModel.findOne({ where: { id: '1' } });
        expect(customerModel).not.toBeNull();
        expect(customerModel.name).toBe('John Doe');

        handleSpy1.mockRestore();
        handleSpy2.mockRestore();
    });

    test('Should handle multiple customer created events', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const listener1 = new ConsoleLog1WhenCustomerIsCreatedEventListener();
        const listener2 = new ConsoleLog2WhenCustomerIsCreatedEventListener();
        
        eventDispatcher.register('CustomerCreatedEvent', listener1);
        eventDispatcher.register('CustomerCreatedEvent', listener2);

        const address1 = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer1 = Customer.create('1', 'John Doe');
        customer1.Address = address1;
        
        const address2 = new Address('456 Oak Ave', 789, 'Shelbyville', '67890');
        const customer2 = Customer.create('2', 'Jane Smith');
        customer2.Address = address2;

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const events1 = customer1.getEvents();
        const events2 = customer2.getEvents();
        
        [...events1, ...events2].forEach(event => {
            eventDispatcher.notify(event);
        });
        
        expect(consoleLogSpy).toHaveBeenCalledTimes(4); // 2 listeners × 2 customers
        expect(consoleLogSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
        expect(consoleLogSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');

        const customerModel1 = await CustomerModel.findOne({ where: { id: '1' } });
        const customerModel2 = await CustomerModel.findOne({ where: { id: '2' } });
        
        expect(customerModel1).not.toBeNull();
        expect(customerModel2).not.toBeNull();
        expect(customerModel1.name).toBe('John Doe');
        expect(customerModel2.name).toBe('Jane Smith');

        consoleLogSpy.mockRestore();
    });

    test('Should not dispatch events when no listeners are registered', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const address = new Address('123 Main St', 456, 'Springfield', '12345');
        const customer = Customer.create('1', 'John Doe');
        customer.Address = address;

        await customerRepository.create(customer);

        const events = customer.getEvents();
        events.forEach(event => {
            eventDispatcher.notify(event);
        });

        expect(consoleLogSpy).not.toHaveBeenCalled();
        expect(events.size).toBe(1);

        consoleLogSpy.mockRestore();
    });

    test('Shoult send console.log when address is changed', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const listener = new ConsoleLogWhenCustomerAddressIsChanged();
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.register('CustomerAddressChangedEvent', listener);

        const customer = new Customer('1', 'John Wick');
        const address =  new Address('123 Main St', 456, 'Springfield', '12345');
        
        customer.changeAddress(address);
        
        const newAddress =  new Address('Rua Nova', 123, 'Cidade dos Sonhos', '99999');
        customer.changeAddress(newAddress);
        
        const events = customer.getEvents();

        events.forEach(event => {
            eventDispatcher.notify(event);
        });

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenCalledWith(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${address.toString()}`)
        expect(consoleLogSpy).toHaveBeenCalledWith(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${newAddress.toString()}`)

        consoleLogSpy.mockClear();
    })
});