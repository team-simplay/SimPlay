import { StoreSetCapacityEventArgs } from './StoreSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class StoreSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CAPACITY, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
