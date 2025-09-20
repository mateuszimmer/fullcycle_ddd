import { EventInterface } from "../../@shared/event/event.interface";

export type CustomerCreatedEventData = {
    customerId: string;
    customerName: string;
}

export class CustomerCreatedEvent implements EventInterface {
    readonly eventVersion: number = 1;
    readonly dataTimeOccurred: Date;

    constructor(
        readonly agregateId: string,
        readonly eventData: CustomerCreatedEventData
    ){
        this.dataTimeOccurred = new Date();
    }
}