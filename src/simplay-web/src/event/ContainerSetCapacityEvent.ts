import { ContainerSetCapacityEventArgs } from './ContainerSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ContainerSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ContainerSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_CAPACITY, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
