import { NotificationError } from "../../@shared/notification/notification.error";
import { Address } from "../value-object/address";
import { Customer } from "./customer";

describe('Customer Entity Unit Tests', () => {
    
    test('should throw error when id is empty', () => {
        expect(() => 
            new Customer("", "John")
        ).toThrow(
            new NotificationError([{context: 'customer', message: 'Customer must have a valid id.'}])
        );
    });

    test('should throw error when name is empty', () => {
        expect(() => 
            new Customer("123", "")
        ).toThrow(
            new NotificationError([{context: 'customer', message: 'Customer must have a valid name.'}])
        );
    });

    test('should throw error when name and id is empty', () => {
        expect(() => 
            new Customer("", "")
        ).toThrow(
            new NotificationError([
                {context: 'customer', message: 'Customer must have a valid id.'},
                {context: 'customer', message: 'Customer must have a valid name.'}
            ])
        );
    });

    test('should change customer name', () => {
        const customer = new Customer("123", "John");
        customer.changeName("Doe");
        expect(customer.name).toBe("Doe");
    });

    test('should throw error if try to activate customer without address', () => {
        const customer = new Customer('123', 'John');
        expect(() => 
            customer.activate()
        ).toThrow(
            new Error("Address must be provided before activating the customer.")
        );
    });

    test('should activate a customer with address', () => {
        const customer = new Customer('123', 'John');
        customer.Address = new Address('Main St', 123, 'Anytown', '12345');
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    test('should deactivate a customer', () => {
        const customer = new Customer('123', 'John');
        customer.Address = new Address('Main St', 123, 'Anytown', '12345');
        customer.activate();
        expect(customer.isActive()).toBe(true);
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    test('should add a rewardPoints', () => {
        const customer = new Customer('123', 'John');
        expect(customer.rewardPoints).toBe(0);
        customer.addRewardPoints(100);
        expect(customer.rewardPoints).toBe(100);
        customer.addRewardPoints(20);
        expect(customer.rewardPoints).toBe(120);
    });
});