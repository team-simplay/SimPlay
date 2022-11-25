import { StoreSetCapacityEventArgs } from './StoreSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class StoreSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CAPACITY, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
