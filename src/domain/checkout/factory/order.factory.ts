import { Order } from "../entity/order";
import { OrderItem } from "../entity/order-item";

interface OrderFactoryProps {
    id: string,
    customerId: string,
    items: {
        id: string,
        name: string,
        productId: string,
        quantity: number,
        price: number
    }[]
}

export class OrderFactory {
    public static create(props: OrderFactoryProps): Order {
        const items = props.items.map(e => new OrderItem(e.id, e.name, e.quantity, e.price, e.productId));
        const order = new Order(props.id, props.customerId, items);
        return order;
    }
}