import { ProductInterface } from "./product.interface";

export class ProductB implements ProductInterface {
  
    private _id: string;
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        this._id = id;
        this._name = name;
        this._price = price * 2;
        this.validate();
    }

    validate(): void {
        if (!this._id) {
            throw new Error('Product ID is required');
        }
        if (!this._name) {
            throw new Error('Product name is required');
        }
        if (this._price <= 0) {
            throw new Error('Product price must be greater than zero');
        }
    }

    changeName(newName: string): void {
        this._name = newName;
        this.validate();
    }

    changePrice(newPrice: number): void {
        this._price = newPrice;
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
}