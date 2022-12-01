import { SetPositionEventArgs } from './SetPositionEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityById } from '../Entity';

export class SetPositionEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetPositionEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_POSITION, args);
  }
  execute(context: SimplayContext) {
    const entity = getEntityById(context, this.forId);
    entity.x = this.args.x * context.tileWidth + context.tileWidth / 2;
    entity.y = this.args.y * context.tileHeight + context.tileHeight / 2;
  }
}
