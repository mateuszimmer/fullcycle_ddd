import { Product } from "../../../../domain/product/entity/product";
import { ProductRepositoryInterface } from "../../../../domain/product/repository/product-repository.interface";
import { ProductModel } from "./product.model";

export class ProductRepository implements ProductRepositoryInterface {
    
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.getId(),
            name: entity.name,
            price: entity.price
        });
    }
    async update(entity: Product): Promise<void> {
        const persistedEntity = await ProductModel.findOne({ where: { id: entity.getId() }});

        if(!persistedEntity) {
            throw new Error(`Product with id ${entity.getId()} not found`);
        }

        await ProductModel.update({ name: entity.name, price: entity.price }, { where: { id: entity.getId() } });
    }
    async findById(id: string): Promise<Product> {
        const productModel = await ProductModel.findOne({ where: { id } });
        if (!productModel) {
            throw new Error(`Product with id ${id} not found`);
        }
        return new Product(productModel.id, productModel.name, productModel.price);
    }
    async findAll(): Promise<Product[]> {
        const products: ProductModel[] = await ProductModel.findAll();
        return products.map(productModel => new Product(productModel.id, productModel.name, productModel.price));
    }
}