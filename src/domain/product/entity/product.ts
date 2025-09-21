import { AggregateRoot } from "../../@shared/domain/aggregate-root";
import { NotificationError } from "../../@shared/notification/notification.error";
import { ProductInterface } from "./product.interface";

export class Product extends AggregateRoot implements ProductInterface{
  
    private _id: string;
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super();
        this._id = id;
        this._name = name;
        this._price = price;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    validate(): void {
        if (!this._id) {
            this.notification.addError({
                context: 'product',
                message: 'Product ID is required'
            })
        }
        if (!this._name) {
            this.notification.addError({
                context: 'product',
                message: 'Product name is required'
            })
        }
        if (this._price <= 0) {
            this.notification.addError({
                context: 'product',
                message: 'Product price must be greater than zero'
            })
        }
    }

    changeName(newName: string): void {
        this._name = newName;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    changePrice(newPrice: number): void {
        this._price = newPrice;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    update(newName: string, newPrice: number): void {
        this._name = newName
        this._price = newPrice;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    getId(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
}