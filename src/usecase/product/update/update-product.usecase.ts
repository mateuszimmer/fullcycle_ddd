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

        persistedProduct.changeName(input.name);
        persistedProduct.changePrice(input.price);
        
        await this.repo.update(persistedProduct);
        return {
            id: persistedProduct.id,
            name: persistedProduct.name,
            price: persistedProduct.price,
        } as OutputUpdateProductDTO;
    }
}