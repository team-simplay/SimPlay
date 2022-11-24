import { SetTintColorEventArgs } from "./SetTintColorEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class SetTintColorEvent extends Event {
  readonly args: SetTintColorEventArgs;
  constructor(forId: string, timestamp: number, args: SetTintColorEventArgs) {
    super(forId, timestamp, EventAction.SET_TINT_COLOR, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
