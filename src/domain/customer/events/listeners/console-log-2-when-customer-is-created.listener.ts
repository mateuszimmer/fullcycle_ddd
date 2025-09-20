import { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import { CustomerCreatedEvent } from "../customer-created.event";

export class ConsoleLog2WhenCustomerIsCreatedEventListener implements EventHandlerInterface<CustomerCreatedEvent>{
    handle(event: CustomerCreatedEvent) {
        console.log('Esse é o segundo console.log do evento: CustomerCreated')
    }
}