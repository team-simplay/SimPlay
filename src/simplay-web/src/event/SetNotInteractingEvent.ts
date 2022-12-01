import { SetNotInteractingEventArgs } from './SetNotInteractingEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class SetNotInteractingEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetNotInteractingEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_NOT_INTERACTING, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
