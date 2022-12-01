import { MoveNearCellEventArgs } from './MoveNearCellEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';

export class MoveNearCellEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: MoveNearCellEventArgs
  ) {
    super(forId, timestamp, EventAction.MOVE_NEAR_CELL, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
