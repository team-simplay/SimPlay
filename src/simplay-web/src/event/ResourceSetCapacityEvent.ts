import { ResourceSetCapacityEventArgs } from './ResourceSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class ResourceSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ResourceSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_CAPACITY, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
