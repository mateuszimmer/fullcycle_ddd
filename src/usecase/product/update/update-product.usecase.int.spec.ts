import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entity/product";
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputUpdateProductDTO, OutputUpdateProductDTO } from "./update-product.dto";
import { UpdateProductUseCase } from "./update-product.usecase";
import { NotificationError } from "../../../domain/@shared/notification/notification.error";

describe('Update Product Usecase Integration Tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('Should update a product', async () => {
        const repo = new ProductRepository();
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);
        const product = new Product('prod02', 'Old Product Name', 99);

        await repo.create(product);

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: 'new Product Name',
            price: 12.99
        }
 
        const output: OutputUpdateProductDTO = await useCase.execute(input);

        expect(output).toMatchObject(input);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    })

    test('Should throw error if a product is not found', async () => {
        const repo = new ProductRepository();
        const useCase = new UpdateProductUseCase(repo);

        const input: InputUpdateProductDTO = {
            id: 'nonexistent_id',
            name: 'new Product Name',
            price: 12.99
        }

        await expect(useCase.execute(input)).rejects.toThrow(new Error(`Product with id ${input.id} not found`))
    })

    test('Should throw error if a product name is invalid found', async () => {
        const repo = new ProductRepository();
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        const product = new Product('prod02', 'Product Name', 99);

        await repo.create(product);

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: '',
            price: 12.99
        }

        await expect(useCase.execute(input)).rejects.toThrow(
            new NotificationError([{ context: 'product', message: 'Product name is required'}])
        );

        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    })

    test('Should throw error if a product price is invalid found', async () => {
        const repo = new ProductRepository();
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        const product = new Product('prod02', 'Old Product Name', 99);

        await repo.create(product);

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: 'new Product Name',
            price: -10
        }

        await expect(useCase.execute(input)).rejects
            .toThrow(new NotificationError([
                {
                    context: 'product',
                    message: 'Product price must be greater than zero'
                }])
            );

        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

});