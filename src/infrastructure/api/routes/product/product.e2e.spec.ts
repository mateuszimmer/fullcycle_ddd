import { app, sequelize } from "../../express";
import Request from "supertest";

describe('E2E product tests', () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('Should create a Product', async () => {
        const response = await Request(app)
            .post('/product')
            .send({
                type: 'a',
                name: 'Product 1',
                price: 12.5
            });
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Product 1');
        expect(response.body.price).toBe(12.5);
    });

    it('Should not create a Product', async () => {
        const response = await Request(app)
            .post('/product')
            .send({
                type: 'a',
                name: 'Product 1',
                price: -25
            });
        expect(response.status).toBe(500);
    });

    it('Should list Products', async () => {
        const responseProduct1 = await Request(app)
            .post('/product')
            .send({
                type: 'a',
                name: 'Product 1',
                price: 12.5
            });
        expect(responseProduct1.status).toBe(200);
        const responseProduct2 = await Request(app)
            .post('/product')
            .send({
                type: 'a',
                name: 'Product 2',
                price: 23
            });
        expect(responseProduct1.status).toBe(200);

        const productList = await Request(app)
            .get('/product')
            .send();

        expect(productList.status).toBe(200);
        expect(productList.body.products.length).toBe(2);
        const product1 = productList.body.products[0];
        expect(product1).toStrictEqual({
            id: responseProduct1.body.id,
            name: responseProduct1.body.name,
            price: responseProduct1.body.price        
        });
        const product2 = productList.body.products[1];
        expect(product2).toStrictEqual({
            id: responseProduct2.body.id,
            name: responseProduct2.body.name,
            price: responseProduct2.body.price        
        });
    });
});