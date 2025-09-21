export interface ProductInterface {
    getId(): string;
    get name(): string;
    get price(): number;

    validate(): void;
    changeName(name: string): void;
    changePrice(price: number): void;
    update(name: string, price: number): void;
}