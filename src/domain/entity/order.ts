import { OrderItem } from "./order-item";

export class Order {

    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number = 0;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this.validate();
        this._total = this.calculateTotal();
    }

    private calculateTotal(): number {
        return this._items.reduce((total, item) => total + item.orderItemTotal(), 0);
    }

    validate(): void {
        if (!this._id) {
            throw new Error("Order ID is required.");
        }
        if (!this._customerId) {
            throw new Error("Customer ID is required.");
        }
        if (!this._items || this._items.length === 0) {
            throw new Error("Order must have at least one item.");
        }
        if (this._items.some(e => e.quantity <= 0)) {
            throw new Error("Item quantity must be greater than zero.");
        }
        if (this._items.some(e => e.price <= 0)) {
            throw new Error("Item price must be greater than zero.");
        }
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    get total(): number {
        return this._total;
    }

    public addItem(item: OrderItem): void {
        this._items.push(item);
        this._total = this.calculateTotal();
    }
}