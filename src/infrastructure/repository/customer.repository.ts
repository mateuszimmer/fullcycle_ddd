import { Address } from "../../domain/entity/address";
import { Customer } from "../../domain/entity/customer";
import { CustomerRepositoryInterface } from "../../domain/repository/customer-repository.interface";
import { CustomerModel } from "../db/sequelize/model/customer.model";

export class CustomerRepository implements CustomerRepositoryInterface {
    
    async create(entity: Customer): Promise<void> {
        const address: Address = entity.address;
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: address.street,
            number: address.number,
            city: address.city,
            zipCode: address.zipCode,
            active: entity.isActive() ?? false,
            rewardPoints: entity.rewardPoints ?? 0
        });
    }

    async update(entity: Customer): Promise<void> {
        const persistedCustomer = await CustomerModel.findOne({ where: { id: entity.id } });
        if (!persistedCustomer) {
            throw new Error(`Customer with id ${entity.id} not found.`);
        }
        await persistedCustomer.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            zipCode: entity.address.zipCode,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }

    async findById(id: string): Promise<Customer> {
        const customerModel = await CustomerModel.findOne({ where: { id } });

        if (!customerModel) {
            throw new Error('Customer not found');
        }

        const address = new Address(customerModel.street, Number(customerModel.number), customerModel.city, customerModel.zipCode);

        const customer = new Customer(
            customerModel.id,
            customerModel.name
        );

        customer.Address = address;
        
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customers = await CustomerModel.findAll();
        return customers.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name);
            customer.Address = new Address(
                customerModel.street,
                Number(customerModel.number),
                customerModel.city,
                customerModel.zipCode
            );
            if(customerModel.active)
                customer.activate();

            return customer;
        });
    }

}