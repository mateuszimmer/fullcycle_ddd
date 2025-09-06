import { Address } from "./domain/entity/address";
import { Customer } from "./domain/entity/customer";
import { Order } from "./domain/entity/order";
import { OrderItem } from "./domain/entity/order-item";

let customer = new Customer('123', 'John Doe');
const address = new Address('Main St', 456, 'Springfield', '12345');
customer.Address = address;
customer.activate();

const item1 = new OrderItem('item1', 'Product 1', 2, 50, 'p1');
const item2 = new OrderItem('item2', 'Product 2', 1, 30, 'p2');
const order = new Order('order1', "123", [item1, item2]);