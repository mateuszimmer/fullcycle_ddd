import { Product } from "./product";

describe('Product Unit Tests', () => {
    
    test('should throw error if productId is empty', () => {
        expect(() => {
            new Product('', 'Product 1 Name', 10)
        }).toThrow(new Error('Product ID is required'));
    });

    test('should throw error if product name is empty', () => {
        expect(() => {
            new Product('1', '', 10)
        }).toThrow(new Error('Product name is required'));
    });

    test('should throw error if product price is less than or equal to zero', () => {
        expect(() => {
            new Product('1', 'Product 1 Name', 0)
        }).toThrow(new Error('Product price must be greater than zero'));
    });

    test('should change product name', () => {
        const product = new Product('1', 'Old Name', 10);
        product.changeName('New Name');
        expect(product.name).toBe('New Name');
    });

    test('should throw error if new product name is empty', () => {
        const product = new Product('1', 'Valid Name', 10);
        expect(() => {
            product.changeName('');
        }).toThrow(new Error('Product name is required'));
    });

    test('should change product price', () => {
        const product = new Product('1', 'Valid Name', 10);
        product.changePrice(20);
        expect(product.price).toBe(20);
    })

    test('should throw error if new product price is less or equals to zero', () => {
        const product = new Product('1', 'Valid Name', 10);
        expect(() => product.changePrice(0)).toThrow(new Error('Product price must be greater than zero'));
    })
})