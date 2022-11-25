import { SetPositionEventArgs } from './SetPositionEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetPositionEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetPositionEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_POSITION, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
