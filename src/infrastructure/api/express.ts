import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { CustomerModel } from "../customer/repository/sequelize/customer.model";
import { customerRoute } from "./routes/customer/customer.routes";
import { productRoute } from "./routes/product/product.routes";
import { ProductModel } from "../product/repository/sequelize/product.model";

export const app: Express = express();
app.use(express.json());
app.use('/customer', customerRoute);
app.use('/product', productRoute);

export let sequelize: Sequelize;

async function setubDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });
    sequelize.addModels([ CustomerModel, ProductModel ]);
    sequelize.sync();
}
setubDb();