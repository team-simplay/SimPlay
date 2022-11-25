import { Event } from './Event';
import { EventAction } from './EventAction';
import { SetVisibleEventArgs } from './SetVisibleEventArgs';

export class SetVisibleEvent extends Event {
  readonly args: SetVisibleEventArgs;
  constructor(forId: string, timestamp: number, args: SetVisibleEventArgs) {
    super(forId, timestamp, EventAction.SET_VISIBLE, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
