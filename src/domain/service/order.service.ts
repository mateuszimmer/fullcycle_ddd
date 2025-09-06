import { Customer } from "../entity/customer";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/order-item";
import { v4 as Uuid } from "uuid";

export class OrderService {

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (items.length === 0) {
            throw new Error("Order must have at least one item.");
        }
        const order = new Order(Uuid(), customer.id, items);
        customer.addRewardPoints(order.total / 2);
        return order;
    }

    static calculateTotal(orders: Order[]): number {
        return orders.reduce((total, order) => total + order.total, 0);
    }

}