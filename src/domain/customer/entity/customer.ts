import { Address } from "../value-object/address";

export class Customer {

    private _id: string;
    private _name: string;
    private _address?: Address;
    private _active: boolean;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._active = false;
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Customer must have a valid id.");
        }
        if (this._name.length === 0) {
            throw new Error("Customer must have a valid name.");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    addRewardPoints(points: number): void {
        if (points < 0) {
            throw new Error("Points must be a positive value.");
        }
        this._rewardPoints = this._rewardPoints + points;
    }

    activate(): void {
        if(this._address === undefined)
            throw new Error("Address must be provided before activating the customer.");
        this._active = true;
    }

    deactivate(): void {
        this._active = false;
    }

    isActive(): boolean {
        return this._active;
    }

    set Address(address: Address) {
        this._address = address;
    }
}