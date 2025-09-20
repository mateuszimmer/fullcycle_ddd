import { Order } from "../../../../domain/checkout/entity/order";
import { OrderItem } from "../../../../domain/checkout/entity/order-item";
import { OrderRepositoryInterface } from "../../../../domain/checkout/repository/order-repository.interface";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";

export class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total,
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
            })),
        },{
            include: [{model: OrderItemModel }]
        });
    }

    async update(entity: Order): Promise<void> {
        const existingOrder = await OrderModel.findOne({ where: { id: entity.id } });
        
        if (!existingOrder) {
            throw new Error("Order not found");
        }

        await OrderModel.update(
            {
                customerId: entity.customerId,
                total: entity.total,
            },
            {
                where: { id: entity.id }
            }
        );

        await OrderItemModel.destroy({
            where: { orderId: entity.id }
        });

        const orderItemsData = entity.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
            orderId: entity.id
        }));

        await OrderItemModel.bulkCreate(orderItemsData);
    }

    async findById(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: ["items"]
        });

        if (!orderModel) {
            throw new Error("Order not found");
        }

        const items = orderModel.items.map((item: any) => 
            new OrderItem(item.id, item.name, item.quantity, item.price, item.productId)
        );

        return new Order(orderModel.id, orderModel.customerId, items);
    }
    
    async findAll(): Promise<Order[]> {
        const orderModels: OrderModel[] = await OrderModel.findAll({ include: ["items"] });

        if (!orderModels || orderModels.length === 0) {
            return [];
        }

        const orders: Order[] = orderModels.map(om => {
            const order = new Order(om.id, om.customerId, om.items.map((item: any) => 
                new OrderItem(item.id, item.name, item.quantity, item.price, item.productId)
            ));
            return order;
        })
        return orders;
    }
}