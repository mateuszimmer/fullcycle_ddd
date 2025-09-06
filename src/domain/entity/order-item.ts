export class OrderItem {
    private _id: string;
    private _name: string;
    private _quantity: number;
    private _price: number;
    private _productId: string;


    constructor(id: string, name: string, quantity: number, price: number, productId: string) {
        this._id = id;
        this._name = name;
        this._quantity = quantity;
        this._price = price;
        this._productId = productId;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get productId(): string {
        return this._productId;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }

    orderItemTotal():number {
        return this._price * this._quantity;
    }
}