export class Address {
    private _street: string;
    private _number: number;
    private _city: string;
    private _zipCode: string;

    constructor(street: string, number: number, city: string, zipCode: string) {
        this._street = street ?? "";
        this._city = city ?? "";
        this._zipCode = zipCode ?? "";
        this._number = number ?? 0;

        this.validate();
    }

    validate(): void {
        if(this._street.length == 0) {
            throw new Error("Street cannot be empty");
        }
        if (this._city.length == 0) {
            throw new Error("City cannot be empty");
        }
        if (this._number <= 0) {
            throw new Error("Number must be greater than 0");
        }
        if (this._zipCode.length === 0) {
            throw new Error("ZipCode cannot be empty");
        }
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get city(): string {
        return this._city;
    }

    get zipCode(): string {
        return this._zipCode;
    }

    toString(): string {
        return `${this._street}, ${this._number}, ${this._city} - ${this._zipCode}`;
    }
}