import { StoreSetCapacityEventArgs } from "./StoreSetCapacityEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class StoreSetCapacityEvent extends Event {
  args: StoreSetCapacityEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: StoreSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CAPACITY, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
