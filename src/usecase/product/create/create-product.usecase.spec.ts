import { NotificationError } from "../../../domain/@shared/notification/notification.error";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDTO, OutputCreateProductDTO } from "./create-product.dto";
import { CreateProductUseCase } from "./create-product.usecase";

describe('Create Product UseCase Unit Tests', () => {
   
    const repo: jest.Mocked<ProductRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
    }

    test('Should create a product', async () => {
        const input: InputCreateProductDTO = {
            type: 'b',
            name: 'Product Name',
            price: 999
        }
        const createSpy = jest.spyOn(repo, 'create');

        const useCase = new CreateProductUseCase(repo);

        const output: OutputCreateProductDTO = await useCase.execute(input);

        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.price).toBe(input.price * 2);
        expect(createSpy).toHaveBeenCalledTimes(1)
    });

    test('Should throw error if product name is invalid', async () => {
        const input: InputCreateProductDTO = {
            type: 'a',
            name: '',
            price: 999
        }
        const createSpy = jest.spyOn(repo, 'create');

        const useCase = new CreateProductUseCase(repo);

        await expect(useCase.execute(input)).rejects.toThrow(
            new NotificationError([{context: 'product', message: 'Product name is required'}])
        );

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

    test('Should throw error if product price is invalid', async () => {
        const input: InputCreateProductDTO = {
            type: 'b',
            name: 'Product Name',
            price: -2
        }
        const createSpy = jest.spyOn(repo, 'create');

        const useCase = new CreateProductUseCase(repo);

        await expect(useCase.execute(input)).rejects
            .toThrow(new NotificationError([{context: 'Product B', message: 'Product price must be greater than zero'}]));

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

    test('Should throw error if product tupe is invalid', async () => {
        const input: InputCreateProductDTO = {
            type: 'aasd',
            name: 'Product Name',
            price: 10
        }
        const createSpy = jest.spyOn(repo, 'create');

        const useCase = new CreateProductUseCase(repo);

        await expect(useCase.execute(input)).rejects.toThrow(new Error('Product type not supported'));

        expect(createSpy).toHaveBeenCalledTimes(0)
    });

});