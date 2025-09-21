import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entity/product"
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface"
import { OutputListProductsDTO, ProductDTO } from "./list-products.dto";
import { ListProductsUseCase } from "./list-products.usecase";
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repository/sequelize/product.repository";

describe('List Products UseCase Integration Tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    
    test('Should return a list of products', async () => {
        const repo = new ProductRepository();
        const useCase = new ListProductsUseCase(repo);
        
        const product1 = new Product('p1', 'Product Name 1', 222);
        repo.create(product1);
        
        const product2 = new Product('p2', 'Product Name 2', 40);
        repo.create(product2);

        const output = await useCase.execute({});

        expect(output.products).toHaveLength(2);
        expect(output.products[0]).toStrictEqual({
            id: product1.getId(),
            name: product1.name,
            price: product1.price,
        } as ProductDTO);
        expect(output.products[1]).toStrictEqual({
            id: product2.getId(),
            name: product2.name,
            price: product2.price,
        } as ProductDTO);
    })
})