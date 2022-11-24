import { SetInteractingEventArgs } from './SetInteractingEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetInteractingEvent extends Event {
  readonly args: SetInteractingEventArgs;
  constructor(forId: string, timestamp: number, args: SetInteractingEventArgs) {
    super(forId, timestamp, EventAction.SET_INTERACTING, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
