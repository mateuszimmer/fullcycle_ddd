import { AggregateRoot } from "../../@shared/domain/aggregate-root";
import { NotificationError } from "../../@shared/notification/notification.error";
import { CustomerAddressChangedEvent, CustomerAddressChangedEventData } from "../events/customer-address-changed.event";
import { CustomerCreatedEvent, CustomerCreatedEventData } from "../events/customer-created.event";
import { CustomerValidatorFactory } from "../factory/customer-validator.factory";
import { Address } from "../value-object/address";

export class Customer extends AggregateRoot {
    private _name: string;
    private _address?: Address;
    private _active: boolean;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this._name = name;
        this._active = false;
        this.validate();

        if(this.notification.hasErrors()) {
            throw new NotificationError(this.notification.errors);
        }
    }

    getId(): string {
        return this.id;
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

    static create(id: string, name: string) {
        const customer = new Customer(id, name);
        const data: CustomerCreatedEventData = {
            customerId: customer.getId(),
            customerName: customer.name
        }
        customer.addEvent(new CustomerCreatedEvent(customer.getId(), data));
        return customer;
    }

    validate() {
        CustomerValidatorFactory.create().validate(this);
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        const data: CustomerAddressChangedEventData = {
            customerId: this.id,
            customerName: this._name,
            newAddress: address
        }
        this.addEvent(new CustomerAddressChangedEvent(this.id, data));
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