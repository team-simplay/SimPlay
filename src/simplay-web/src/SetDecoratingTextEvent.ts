import { SetDecoratingTextEventArgs } from "./SetDecoratingTextEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class SetDecoratingTextEvent extends Event {
  readonly args: SetDecoratingTextEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: SetDecoratingTextEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_DECORATING_TEXT, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
