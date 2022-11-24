import { ContainerSetLevelEventArgs } from "./ContainerSetLevelEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class ContainerSetLevelEvent extends Event {
  args: ContainerSetLevelEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: ContainerSetLevelEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_LEVEL, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
