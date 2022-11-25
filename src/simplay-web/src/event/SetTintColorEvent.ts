import { SetTintColorEventArgs } from './SetTintColorEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetTintColorEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetTintColorEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_TINT_COLOR, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
