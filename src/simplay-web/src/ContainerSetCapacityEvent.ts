import { ContainerSetCapacityEventArgs } from "./ContainerSetCapacityEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class ContainerSetCapacityEvent extends Event {
  args: ContainerSetCapacityEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: ContainerSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_CAPACITY, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
