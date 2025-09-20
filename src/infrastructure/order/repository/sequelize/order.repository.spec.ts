import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "../../../customer/repository/sequelize/customer.model";
import { ProductModel } from "../../../product/repository/sequelize/product.model";
import { Customer } from "../../../../domain/customer/entity/customer";
import { Address } from "../../../../domain/customer/value-object/address";
import { ProductRepository } from "../../../product/repository/sequelize/product.repository";
import { Product } from "../../../../domain/product/entity/product";
import { OrderItem } from "../../../../domain/checkout/entity/order-item";
import { OrderRepository } from "./order.repository";
import { Order } from "../../../../domain/checkout/entity/order";
import { OrderModel } from "./order.model";
import { OrderItemModel } from "./order-item.model";
import { CustomerRepository } from "../../../customer/repository/sequelize/customer.repository";


describe('Order Repository Tests', () => {

     let sequelize: Sequelize;
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Doe");
        const address = new Address("Main St", 123, "State", "12345");
        customer.Address = address;
        customer.activate();
        customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product Name", 100);
        productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, 10, product.price, product.id);
        
        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem]);

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: 1 },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customerId: customer.id,
            items: [
                {
                    id: "1",
                    orderId: "1",
                    name: product.name,
                    price: product.price,
                    productId: product.id,
                    quantity: 10
                }
            ],
            total: 1000
        })
    });

    test('should update a Order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, 10, product.price, product.id);

        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = new Product("p2", "Product 2", 200);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem("i2", product2.name, 5, product2.price, product2.id);
        order.addItem(orderItem2);

        await orderRepository.update(order);

        const updatedOrderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(updatedOrderModel.toJSON()).toStrictEqual({
            id: "o1",
            customerId: customer.id,
            items: [
                {
                    id: "i1",
                    orderId: "o1",
                    name: product.name,
                    price: product.price,
                    productId: product.id,
                    quantity: 10
                },
                {
                    id: "i2",
                    orderId: "o1",
                    name: product2.name,
                    price: product2.price,
                    productId: product2.id,
                    quantity: 5
                }
            ],
            total: 2000
        });
    });

    test('should throw error if order is not found on update', async () => {
        
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.Address = address;
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);
        
        const product = new Product("p1", "Product 1", 100);
        const productRepository = new ProductRepository();
        await productRepository.create(product);
        
        const orderItem = new OrderItem("i1", product.name, 10, product.price, product.id);
        
        const order = new Order("1", "c1", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        
        const orderItem2 = new OrderItem("i1", product.name, 10, product.price, product.id);
        const orderDontExists = new Order("2", "c1", [orderItem2]);

        await expect(orderRepository.update(orderDontExists)).rejects.toThrow("Order not found");
    })
   
    test('should throw error if order is not found on find by id', async () => {
        const orderRepository = new OrderRepository();
        await expect(orderRepository.findById("123456")).rejects.toThrow("Order not found");
    })

    test('should return a order if it is finded', async () => {
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Main St", 123, "State", "12345");
        customer.Address = address;
        customer.activate();
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);

        const product = new Product("1", "Product 1", 100);
        const productRepository = new ProductRepository();
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, 10, product.price, product.id);
        const order = new Order("o1", "c1", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const returnedOrder = await orderRepository.findById(order.id);

        expect(returnedOrder).toStrictEqual(order);
    });

    test('should return a empty list if not found any order', async () => {
        const orderRepository = new OrderRepository();
        const orders = await orderRepository.findAll();
        expect(orders).toEqual([]);
    });

    test('should return a list of Order', async () => {
        const customers: Customer[] = [
            new Customer("1", "Customer 1"),
            new Customer("2", "Customer 2"),
        ];
        const adrresses: Address[] = [
            new Address("Street 1", 321, "State 1", "ZipCode 1"),
            new Address("Street 2", 123, "State 2", "ZipCode 2")
        ];
        customers.forEach((customer, index) => customer.Address = adrresses[index]);

        const customerRepository = new CustomerRepository();
        customers.forEach(async (customer) => await customerRepository.create(customer));
        
        const retrievedCustomers = await customerRepository.findAll();

        expect(retrievedCustomers).toHaveLength(customers.length);
        expect(retrievedCustomers).toEqual(expect.arrayContaining(customers));
    })
})