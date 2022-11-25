import { SetInteractingEventArgs } from './SetInteractingEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetInteractingEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetInteractingEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_INTERACTING, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
