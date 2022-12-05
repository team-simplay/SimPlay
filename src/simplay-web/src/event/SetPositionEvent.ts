import { SetPositionEventArgs } from './SetPositionEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class SetPositionEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetPositionEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_POSITION, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
