import { CustomerAddressChangedEvent } from "../customer-address-changed.event";

export class ConsoleLogWhenCustomerAddressIsChanged {
    handle(event: CustomerAddressChangedEvent) {
        const data = event.eventData;
        console.log(`Endereço do cliente: ${data.customerId}, ${data.customerName} alterado para: ${data.newAddress.toString()}`)
    }
}