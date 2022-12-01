import { SimplayContext } from '../SimplayContext';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SetVisibleEventArgs } from './SetVisibleEventArgs';

export class SetVisibleEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetVisibleEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_VISIBLE, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
