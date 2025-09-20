import { app, sequelize } from '../../express';
import Request from 'supertest';

describe('E2E tests for customer', () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('Should create a new Customer', async () => {
        const response = await Request(app)
            .post('/customer')
            .send({
                name: 'James Bond',
                address: {
                    street: 'Main St.',
                    number: 700,
                    city: 'London',
                    zipCode: '007'
                }
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('James Bond');
        expect(response.body.address.street).toBe('Main St.');
        expect(response.body.address.number).toBe(700);
        expect(response.body.address.city).toBe('London');
        expect(response.body.address.zipCode).toBe('007');
    });

    it('Should not create a customer', async () => {
        const response = await Request(app)
            .post('/customer')
            .send({
                name: "John"
            });
        expect(response.status).toBe(500);
    });

    it('Should list all customers', async () => {
        const response = await Request(app)
            .post('/customer')
            .send({
                name: 'James Bond',
                address: {
                    street: 'Main St.',
                    number: 700,
                    city: 'London',
                    zipCode: '007'
                }
            });
        expect(response.status).toBe(200);

        const response2 = await Request(app)
            .post('/customer')
            .send({
                name: 'Irmão do Jorel',
                address: {
                    street: 'Rua Getúlio Vargas',
                    number: 123,
                    city: 'Brasilia',
                    zipCode: '001258'
                }
            });
        expect(response.status).toBe(200);

        const listResponse = await Request(app)
            .get('/customer')
            .send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer1 = listResponse.body.customers[0]
        expect(customer1.name).toBe('James Bond');
        expect(customer1.address).toStrictEqual({
            street: 'Main St.',
            number: 700,
            city: 'London',
            zipCode: '007'
        });
        const customer2 = listResponse.body.customers[1]
        expect(customer2.name).toBe('Irmão do Jorel');
        expect(customer2.address).toStrictEqual({
            street: 'Rua Getúlio Vargas',
            number: 123,
            city: 'Brasilia',
            zipCode: '001258'
        });
    });
});