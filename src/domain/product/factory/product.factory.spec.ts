import { ProductFactory } from "./product.factory";

describe('Product Factory unit tests', () => {

    test('Should create a product type a', () => {
        const product = ProductFactory.create('a', 'Product A', 1);

        expect(product.getId()).toBeDefined();
        expect(product.name).toBe('Product A');
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe('Product');
    });

    test('Should create a product type b', () => {
        const product = ProductFactory.create('b', 'Product B', 1);

        expect(product.getId()).toBeDefined();
        expect(product.name).toBe('Product B');
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe('ProductB');
    });

    test('Should throw error when product type is not supported', () => {
        expect(() => ProductFactory.create('c', 'Product C', 1)).toThrow(new Error('Product type not supported'));
    });
});