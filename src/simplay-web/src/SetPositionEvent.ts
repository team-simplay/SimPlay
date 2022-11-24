import { SetPositionEventArgs } from "./SetPositionEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class SetPositionEvent extends Event {
  readonly args: SetPositionEventArgs;
  constructor(forId: string, timestamp: number, args: SetPositionEventArgs) {
    super(forId, timestamp, EventAction.SET_POSITION, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
