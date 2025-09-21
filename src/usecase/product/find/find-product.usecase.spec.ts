import { Product } from "../../../domain/product/entity/product"
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface"
import { OutputFindProductDTO } from "./find-product.dto";
import { FindProductUseCase } from "./find-product.usecase";

describe('Find Product Unit Tests', () => {

    const repo: jest.Mocked<ProductRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    };

    const product = new Product('p1', 'Hot Weels Car', 22.50);

    test('Should return a Product', async () => {
        
        repo.findById.mockReturnValue(Promise.resolve(product));

        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new FindProductUseCase(repo);

        const output = await useCase.execute({ id: 'p1' });

        expect(output).toStrictEqual({
            id: product.getId(),
            name: product.name,
            price: product.price
        } as OutputFindProductDTO)

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('p1');
    });

    test('Should return a Product', async () => {
        
        repo.findById.mockImplementation(id => {
            throw new Error(`Product with id ${id} not found`)
        });

        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new FindProductUseCase(repo);

        await expect(useCase.execute({ id: 'p3' })).rejects.toThrow(new Error('Product with id p3 not found'))

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('p3');
    });

})