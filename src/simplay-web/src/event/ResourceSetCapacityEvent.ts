import { ResourceSetCapacityEventArgs } from './ResourceSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ResourceSetCapacityEvent extends Event {
  readonly args: ResourceSetCapacityEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: ResourceSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_CAPACITY, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
