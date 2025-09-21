import { Product } from "../../../domain/product/entity/product";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDTO, OutputUpdateProductDTO } from "./update-product.dto";

export class UpdateProductUseCase {
    private repo: ProductRepositoryInterface;
    
    constructor(repository: ProductRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputUpdateProductDTO): Promise<OutputUpdateProductDTO> {
        const persistedProduct = await this.repo.findById(input.id);

        persistedProduct.update(input.name, input.price);
        
        await this.repo.update(persistedProduct);
        return {
            id: persistedProduct.getId(),
            name: persistedProduct.name,
            price: persistedProduct.price,
        } as OutputUpdateProductDTO;
    }
}