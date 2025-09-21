import { AggregateRoot } from "../../@shared/domain/aggregate-root";
import { NotificationError } from "../../@shared/notification/notification.error";
import { ProductValidatorFactory } from "../factory/product-validator.factory";
import { ProductInterface } from "./product.interface";

export class ProductB extends AggregateRoot implements ProductInterface {
  
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super();
        this.id = id;
        this._name = name;
        this._price = price * 2;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    validate(): void {
        ProductValidatorFactory.create().validate(this);
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
        this._name = newName;
        this._price = newPrice;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    getId(): string {
        return this.id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
}