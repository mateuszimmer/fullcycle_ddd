import { Sequelize } from "sequelize-typescript";
import { Product } from "../../../domain/product/entity/product";
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/product.model";
import { ProductRepository } from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputFindProductDTO } from "./find-product.dto";
import { FindProductUseCase } from "./find-product.usecase";

describe('Find Product Integration Tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        })
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    
    test('Should return a Product', async () => {
        const repo = new ProductRepository();
        const useCase = new FindProductUseCase(repo);

        const findByIdSpy = jest.spyOn(repo, 'findById');

        const product = new Product('p123', 'House', 110);

        repo.create(product);

        const output = await useCase.execute({ id: 'p123' });

        expect(output).toStrictEqual({
            id: product.getId(),
            name: product.name,
            price: product.price
        } as OutputFindProductDTO)

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('p123');
    });

    test('Should throw error if a Product is not found', async () => {
        const repo = new ProductRepository();
        const findByIdSpy = jest.spyOn(repo, 'findById');

        const useCase = new FindProductUseCase(repo);

        await expect(useCase.execute({ id: 'p3' })).rejects.toThrow(new Error('Product with id p3 not found'));

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith('p3');
    });

})