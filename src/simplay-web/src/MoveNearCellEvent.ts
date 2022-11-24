import { MoveNearCellEventArgs } from './MoveNearCellEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class MoveNearCellEvent extends Event {
  readonly args: MoveNearCellEventArgs;
  constructor(forId: string, timestamp: number, args: MoveNearCellEventArgs) {
    super(forId, timestamp, EventAction.MOVE_NEAR_CELL, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
