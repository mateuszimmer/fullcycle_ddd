import { Product } from "../../../domain/product/entity/product";
import { ProductFactory } from "../../../domain/product/factory/product.factory";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDTO, OutputCreateProductDTO } from "./create-product.dto";

export class CreateProductUseCase {
    private repo: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputCreateProductDTO): Promise<OutputCreateProductDTO> {
        const product = ProductFactory.create(input.type, input.name, input.price);
        await this.repo.create(product);
        return {
            id: product.getId(),
            name: product.name,
            price: product.price
        } as OutputCreateProductDTO;
    } 
}