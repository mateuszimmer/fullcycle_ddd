import { Sequelize } from "sequelize-typescript"
import { ProductModel } from "./product.model";
import { Product } from "../../../../domain/product/entity/product";
import { ProductRepository } from "./product.repository";

describe('ProductRepository tests', () => {

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

    test('should create a product', async () => {

        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product1', 100);

        await productRepository.create(product);
        
        const productModel = await ProductModel.findOne({where: {id:'1'}});
        expect(productModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product1',
            price: 100
        })
    });
    
    test('should update a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product1', 100);
        
        await productRepository.create(product);
        const originalProductModel = await ProductModel.findOne({ where: { id: '1' } });
        expect(originalProductModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product1',
            price: 100
        })
        
        const updatedProduct = new Product('1', 'UpdatedProduct', 150);
        await productRepository.update(updatedProduct);
        
        const updatedProductModel = await ProductModel.findOne({ where: { id: '1' } });
        
        expect(updatedProductModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'UpdatedProduct',
            price: 150
        });
    });
    
    test('should find a product', async () => {
        const productRepository = new ProductRepository();
        const productModel = await ProductModel.create({
            id: '1',
            name: 'TestProduct',
            price: 100
        });

        const product = await productRepository.findById('1');

        expect(product.getId()).toBe('1');
        expect(product.name).toBe('TestProduct');
        expect(product.price).toBe(100);
    });

    test('should return all products', async () => {
        const productRepository = new ProductRepository();
        await ProductModel.create({ id: '1', name: 'Product1', price: 100 });
        await ProductModel.create({ id: '2', name: 'Product2', price: 200 });

        const products = await productRepository.findAll();

        expect(products).toHaveLength(2);
        expect(products[0].getId()).toBe
    });
})