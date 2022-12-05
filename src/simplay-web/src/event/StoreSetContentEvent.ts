import { StoreSetContentEventArgs } from './StoreSetContentEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class StoreSetContentEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetContentEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CONTENT, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
