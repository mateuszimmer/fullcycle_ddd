import { NotificationError } from "../../@shared/notification/notification.error";
import { Product } from "./product";

describe('Product Unit Tests', () => {
    
    test('should throw error if productId is empty', () => {
        expect(() => {
            new Product('', 'Product 1 Name', 10)
        }).toThrow(
            new NotificationError([{context: 'product', message: 'Product ID is required'}])
        );
    });

    test('should throw error if product name is empty', () => {
        expect(() => {
            new Product('1', '', 10)
        }).toThrow(
            new NotificationError([{context: 'product', message: 'Product name is required'}])
        );
    });

    test('should throw error if product price is less than or equal to zero', () => {
        expect(() => {
            new Product('1', 'Product 1 Name', 0)
        }).toThrow(
            new NotificationError([{context: 'product', message: 'Product price must be greater than zero'}])
        );
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
        }).toThrow(
            new NotificationError([{context: 'product', message: 'Product name is required'}])
        );
    });
    
    test('should change product price', () => {
        const product = new Product('1', 'Valid Name', 10);
        product.changePrice(20);
        expect(product.price).toBe(20);
    })
    
    test('should throw error if new product price is less or equals to zero', () => {
        const product = new Product('1', 'Valid Name', 10);
        expect(() => product.changePrice(0)).toThrow(
            new NotificationError([{context: 'product', message: 'Product price must be greater than zero'}])
        );
    })
    
    test('should throw error if new product name and price are invalid', () => {
        const product = new Product('1', 'Valid Name', 10);
        expect(() => product.update("", 0)).toThrow(
            new NotificationError([
                {context: 'product', message: 'Product name is required'},
                {context: 'product', message: 'Product price must be greater than zero'}
            ])
        );
    })
})