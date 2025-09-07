import { Order } from "./order";
import { OrderItem } from "./order-item";

describe('Order Entity Unit Tests', () => {

    test('should throw error if id is invalid', () => {
        expect(() => new Order('', '123', [])).toThrow(new Error('Order ID is required.'));
    });

    test('should throw error if customerId is invalid', () => {
        expect(() => new Order('1', '', [])).toThrow(new Error('Customer ID is required.'));
    });

    test('should throw error if items are empty', () => {
        expect(() => new Order('1', '123', [])).toThrow(new Error('Order must have at least one item.'));
    });

    test('should calculate total price of the order', () => {
        const item1 = new OrderItem('1', 'Product 1', 10, 1, 'p1');
        const item2 = new OrderItem('2', 'Product 2', 20, 2, 'p2');
        const items = [item1, item2];
        const order = new Order('1', '123', items);
        expect(order.total).toBe(50);
    });

    test('should create an order with valid properties', () => {
        const item1 = new OrderItem('1', 'Product 1', 10, 1, 'p1');
        const item2 = new OrderItem('2', 'Product 2', 20, 2, 'p2');
        const items = [item1, item2];
        const order = new Order('1', '123', items);
        expect(order).toBeDefined();
    });
    
    test('should check if item quantity is greater than zero', () => {
        expect(() => {
            new Order('1', '123', [
                new OrderItem('1', 'Product 1', 0, 10, 'p1')
            ]);
        }
        ).toThrow(
            new Error('Item quantity must be greater than zero.')
        );
    });
    test('should check if item price is greater than zero', () => {
        expect(() => {
            new Order('1', '123', [
                new OrderItem('1', 'Product 1', 10, 0, 'p1')
            ]);
        }
        ).toThrow(
            new Error('Item price must be greater than zero.')
        );
    });
})