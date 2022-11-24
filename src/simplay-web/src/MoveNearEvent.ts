import { MoveNearEventArgs } from "./MoveNearEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class MoveNearEvent extends Event {
  readonly args: MoveNearEventArgs;
  constructor(forId: string, timestamp: number, args: MoveNearEventArgs) {
    super(forId, timestamp, EventAction.MOVE_NEAR, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
