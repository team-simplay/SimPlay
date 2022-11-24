import { SetNotInteractingEventArgs } from "./SetNotInteractingEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class SetNotInteractingEvent extends Event {
  args: SetNotInteractingEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: SetNotInteractingEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_NOT_INTERACTING, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
