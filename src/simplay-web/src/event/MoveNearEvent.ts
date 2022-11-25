import { MoveNearEventArgs } from './MoveNearEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class MoveNearEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: MoveNearEventArgs
  ) {
    super(forId, timestamp, EventAction.MOVE_NEAR, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
