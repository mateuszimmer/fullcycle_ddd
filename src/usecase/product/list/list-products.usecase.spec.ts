import { Product } from "../../../domain/product/entity/product"
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface"
import { OutputListProductsDTO, ProductDTO } from "./list-products.dto";
import { ListProductsUseCase } from "./list-products.usecase";

describe('List Products UseCase Unit Tests', () => {
    const product1 = new Product('p1', 'Product Name 1', 222);
    const product2 = new Product('p2', 'Product Name 2', 40);

    const repo: jest.Mocked<ProductRepositoryInterface> = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    }

    test('Should return a list of products', async () => {
        const useCase = new ListProductsUseCase(repo);

        const output = await useCase.execute({});

        expect(output.products).toHaveLength(2);
        expect(output.products[0]).toStrictEqual({
            id: product1.id,
            name: product1.name,
            price: product1.price,
        } as ProductDTO);
        expect(output.products[1]).toStrictEqual({
            id: product2.id,
            name: product2.name,
            price: product2.price,
        } as ProductDTO);
    })
})