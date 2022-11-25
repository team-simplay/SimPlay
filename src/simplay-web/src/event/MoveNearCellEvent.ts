import { MoveNearCellEventArgs } from './MoveNearCellEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class MoveNearCellEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: MoveNearCellEventArgs
  ) {
    super(forId, timestamp, EventAction.MOVE_NEAR_CELL, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
