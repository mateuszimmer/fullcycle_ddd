import { Sequelize } from "sequelize-typescript";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDTO, OutputCreateProductDTO } from "./create-product.dto";
import { CreateProductUseCase } from "./create-product.usecase";
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repository/sequelize/product.repository";
import { NotificationError } from "../../../domain/@shared/notification/notification.error";

describe('Create Product UseCase Unit Tests', () => {
   
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    test('Should create a product', async () => {
        const repo = new ProductRepository();
        const useCase = new CreateProductUseCase(repo);
        const createSpy = jest.spyOn(repo, 'create');
        
        const input: InputCreateProductDTO = {
            type: 'b',
            name: 'Product Name',
            price: 999
        }

        const output: OutputCreateProductDTO = await useCase.execute(input);

        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.price).toBe(input.price * 2);
        expect(createSpy).toHaveBeenCalledTimes(1)
    });

    test('Should throw error if product name is invalid', async () => {
        const repo = new ProductRepository();
        const useCase = new CreateProductUseCase(repo);
        const createSpy = jest.spyOn(repo, 'create');
        
        const input: InputCreateProductDTO = {
            type: 'a',
            name: '',
            price: 999
        }

        await expect(useCase.execute(input)).rejects
            .toThrow(new NotificationError([{context: 'product', message: 'name is a required field'}]));

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

    test('Should throw error if product price is invalid', async () => {
        const repo = new ProductRepository();
        const useCase = new CreateProductUseCase(repo);
        const createSpy = jest.spyOn(repo, 'create');
        
        const input: InputCreateProductDTO = {
            type: 'b',
            name: 'Product Name',
            price: -2
        }

        await expect(useCase.execute(input)).rejects
            .toThrow(new NotificationError([{context: 'product', message: 'price must be a positive number'}]));

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

    test('Should throw error if product tupe is invalid', async () => {
        const repo = new ProductRepository();
        const useCase = new CreateProductUseCase(repo);
        const createSpy = jest.spyOn(repo, 'create');
        
        const input: InputCreateProductDTO = {
            type: 'aasd',
            name: 'Product Name',
            price: 10
        }
        
        await expect(useCase.execute(input)).rejects.toThrow(new Error('Product type not supported'));

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

});