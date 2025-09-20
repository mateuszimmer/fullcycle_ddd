import { Product } from "../../../domain/product/entity/product";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDTO, OutputUpdateProductDTO } from "./update-product.dto";
import { UpdateProductUseCase } from "./update-product.usecase";

describe('Update Product Usecase Unit Tests', () => {
    const repo: jest.Mocked<ProductRepositoryInterface> = {
         create: jest.fn(),
         update: jest.fn(),
         findById: jest.fn(),
         findAll: jest.fn(),
    }

    test('Should update a product', async () => {
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        const product = new Product('prod02', 'Old Product Name', 99);

        repo.findById.mockReturnValue(Promise.resolve(product));

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: 'new Product Name',
            price: 12.99
        }

        const output: OutputUpdateProductDTO = await useCase.execute(input);

        expect(output).toMatchObject(input);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('Should throw error if a product is not found', async () => {
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        repo.findById.mockImplementation(() => {
            throw new Error('Product Not Found')
        });

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: 'new Product Name',
            price: 12.99
        }

        await expect(useCase.execute(input)).rejects.toThrow(new Error('Product Not Found'));

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).toHaveBeenCalledTimes(0);
    });

    test('Should throw error if a product name is invalid found', async () => {
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        const product = new Product('prod02', 'Product Name', 99);

        repo.findById.mockReturnValue(Promise.resolve(product));

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: '',
            price: 12.99
        }

        await expect(useCase.execute(input)).rejects.toThrow(new Error('Product name is required'));

        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('Should throw error if a product price is invalid found', async () => {
        const updateSpy = jest.spyOn(repo, 'update');
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new UpdateProductUseCase(repo);

        const product = new Product('prod02', 'Old Product Name', 99);

        repo.findById.mockReturnValue(Promise.resolve(product));

        const input: InputUpdateProductDTO = {
            id: 'prod02',
            name: 'new Product Name',
            price: -10
        }

        await expect(useCase.execute(input)).rejects.toThrow(new Error('Product price must be greater than zero'));

        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

});