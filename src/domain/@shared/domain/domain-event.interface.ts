export interface DomainEventInterface {
    agregateId: string;
    ocurredOn: Date;
    eventVersion: number;
    eventData: any;
}