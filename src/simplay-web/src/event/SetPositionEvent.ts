import { SetPositionEventArgs } from './SetPositionEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class SetPositionEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetPositionEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_POSITION, args);
  }
  execute(context: SimplayContext) {
    const entity = getEntityDisplayObjectById(context, this.forId);
    const entityBounds = entity.animatedSprite.getBounds();
    entity.container.x =
      this.args.x * context.tileWidth +
      context.tileWidth / 2 -
      entityBounds.width / 2;
    entity.container.y =
      this.args.y * context.tileHeight +
      context.tileHeight / 2 -
      entityBounds.height / 2;
  }
}
