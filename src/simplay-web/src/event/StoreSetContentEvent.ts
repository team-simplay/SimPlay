import { StoreSetContentEventArgs } from './StoreSetContentEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class StoreSetContentEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetContentEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CONTENT, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
