import { Address } from "../value-object/address";
import { CustomerFactory } from "./customer.factory";

describe('Customer Factory unit tests', () => {

    test('Should create a new customer', () => {
        const customer = CustomerFactory.create('John');

        expect(customer.getId()).toBeDefined();
        expect(customer.name).toBe('John');
        expect(customer.address).toBeUndefined();
    });

    test('Should create a new customer with address', () => {
        const address = new Address('Street 1', 123, 'St Louis', '123456')
        const customer = CustomerFactory.createWithAddress('John', address);
        expect(customer.getId()).toBeDefined();
        expect(customer.name).toBe('John');
        expect(customer.address).toMatchObject(address);
    });

});