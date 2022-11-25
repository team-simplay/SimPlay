import { StoreSetContentEventArgs } from './StoreSetContentEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class StoreSetContentEvent extends Event {
  readonly args: StoreSetContentEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: StoreSetContentEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CONTENT, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
