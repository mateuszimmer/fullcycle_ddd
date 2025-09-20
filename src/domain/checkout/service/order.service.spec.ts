import { Customer } from "../../customer/entity/customer";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/order-item";
import { OrderService } from "./order.service";

describe('OrderService Unit Tests', () => {

    test('should place an order', () => {

        const customer1 = new Customer('1', 'Customer 1');
        const orderItem1 = new OrderItem('1', 'item1', 2, 50, '1');
        const orderItem2 = new OrderItem('2', 'item2', 2, 150, '2');

        const oreder = OrderService.placeOrder(customer1, [orderItem1, orderItem2]);

        expect(customer1.rewardPoints).toBe(200);
        expect(oreder.total).toBe(400);

    });
    
    test('should return total of all orders', () => {
        const orderItem1 = new OrderItem('1', 'item1', 2, 50, '1');
        const orderItem2 = new OrderItem('2', 'item2', 2, 150, '2');
        const order1 = new Order('1', 'customer1', [orderItem1]);
        const order2 = new Order('2', 'customer2', [orderItem2]);

        const total = OrderService.calculateTotal([order1, order2]);

        expect(total).toBe(400);
    });

});