import { EventInterface } from "../event/event.interface";

export abstract class AggregateRoot {
    events: Set<EventInterface> = new Set();

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