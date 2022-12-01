import { SimplayContext } from '../SimplayContext';
import { ContainerSetLevelEventArgs } from './ContainerSetLevelEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ContainerSetLevelEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ContainerSetLevelEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_LEVEL, args);
  }
  execute(context: SimplayContext) {
    throw new Error('Method not implemented.');
  }
}
