import { MoveNearEventArgs } from './MoveNearEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class MoveNearEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: MoveNearEventArgs
  ) {
    super(forId, timestamp, EventAction.MOVE_NEAR, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(context, this.forId);
    const targetDisplayObject = getEntityDisplayObjectById(
      context,
      this.args.target
    );
    const x = targetDisplayObject.x + (Math.random() - 0.5) * context.tileWidth;
    const y =
      targetDisplayObject.y + (Math.random() - 0.5) * context.tileHeight;

    const entityWidth = entityDisplayObject.getBounds().width;
    const entityHeight = entityDisplayObject.getBounds().height;

    const xAdjust = (entityWidth - context.tileWidth) / 2;
    const yAdjust = (entityHeight - context.tileHeight) / 2;

    entityDisplayObject.x = x - xAdjust;
    entityDisplayObject.y = y - yAdjust;
  }
}
