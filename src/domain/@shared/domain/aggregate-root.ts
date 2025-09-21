import { EventInterface } from "../event/event.interface";
import { Notification } from "../notification/notification";

export abstract class AggregateRoot {

    protected id: string;
    public notification: Notification;
    events: Set<EventInterface> = new Set();

    constructor() {
        this.notification = new Notification();
    }

    addEvent(event: EventInterface): void {
        this.events.add(event)
    }

    getEvents(): Set<EventInterface> {
        return this.events;
    }

    clearEvents(): void {
        this.events.clear();
    }
}