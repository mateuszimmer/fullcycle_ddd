import express, { Request, Response } from 'express';
import { CreateCustomerUseCase } from '../../../../usecase/customer/create/create-customer.usecase';
import { CustomerRepository } from '../../../customer/repository/sequelize/customer.repository';
import { InputCreateCustomerDTO } from '../../../../usecase/customer/create/create-customer.dto';
import { ListCustomerUseCase } from '../../../../usecase/customer/list/list-customer.usecase';

export const customerRoute = express.Router();

customerRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new CreateCustomerUseCase(new CustomerRepository());
    try {
        const customerDTO: InputCreateCustomerDTO = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                number: req.body.address.number,
                city: req.body.address.city,
                zipCode: req.body.address.zipCode,
            }
        }
        const output = await useCase.execute(customerDTO);
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});

customerRoute.get('/', async (req: Request, res: Response) => {
    const useCase = new ListCustomerUseCase(new CustomerRepository());
    try {
        const output = await useCase.execute({});
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});