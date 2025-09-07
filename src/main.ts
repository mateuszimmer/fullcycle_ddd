import { Address } from "./domain/customer/value-object/address";
import { Customer } from "./domain/customer/entity/customer";
import { OrderItem } from "./domain/checkout/entity/order-item";
import { Order } from "./domain/checkout/entity/order";

let customer = new Customer('123', 'John Doe');
const address = new Address('Main St', 456, 'Springfield', '12345');
customer.Address = address;
customer.activate();

const item1 = new OrderItem('item1', 'Product 1', 2, 50, 'p1');
const item2 = new OrderItem('item2', 'Product 2', 1, 30, 'p2');
const order = new Order('order1', "123", [item1, item2]);