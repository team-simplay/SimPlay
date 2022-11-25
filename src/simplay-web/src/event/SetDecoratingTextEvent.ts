import { SetDecoratingTextEventArgs } from './SetDecoratingTextEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetDecoratingTextEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetDecoratingTextEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_DECORATING_TEXT, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
