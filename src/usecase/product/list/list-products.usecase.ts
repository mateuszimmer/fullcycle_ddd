import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputListProductsDTO, OutputListProductsDTO, ProductDTO } from "./list-products.dto";

export class ListProductsUseCase {
    private repo: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputListProductsDTO) {
        const persistedProducts = await this.repo.findAll();
        return {
            products: persistedProducts.map(product => {
                return {
                    id: product.getId(),
                    name: product.name,
                    price: product.price
                } as ProductDTO
            })
        } as OutputListProductsDTO
    }
}