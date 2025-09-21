import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputFindProductDTO, OutputFindProductDTO } from "./find-product.dto";

export class FindProductUseCase {
    private repo: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this.repo = repository;
    }

    public async execute(input: InputFindProductDTO): Promise<OutputFindProductDTO> {
        const product = await this.repo.findById(input.id);
        
        return {
            id: product.getId(),
            name: product.name,
            price: product.price
        } as OutputFindProductDTO;
    }
}