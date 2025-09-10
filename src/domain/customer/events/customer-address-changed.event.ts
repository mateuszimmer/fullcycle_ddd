import { EventInterface } from "../../@shared/event/event.interface";
import { Address } from "../value-object/address";

export type CustomerAddressChangedEventData = {
    customerId: string;
    customerName: string;
    newAddress: Address;
}

export class CustomerAddressChangedEvent implements EventInterface {
    readonly dataTimeOccurred: Date;
    readonly eventVersion: number = 1;

    constructor(
        readonly agregateId: string,
        readonly eventData: CustomerAddressChangedEventData
    ){
        this.dataTimeOccurred = new Date();
    }
}