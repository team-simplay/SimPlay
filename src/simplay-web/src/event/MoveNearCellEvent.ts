import { MoveNearCellEventArgs } from './MoveNearCellEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class MoveNearCellEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: MoveNearCellEventArgs
  ) {
    super(forId, timestamp, EventAction.MOVE_NEAR_CELL, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(context, this.forId);
    const cellCenterX = this.args.x * context.tileWidth + context.tileWidth / 2;
    const cellCenterY =
      this.args.y * context.tileHeight + context.tileHeight / 2;
    const x = cellCenterX + (Math.random() - 0.5) * context.tileWidth;
    const y = cellCenterY + (Math.random() - 0.5) * context.tileHeight;

    const entityWidth = entityDisplayObject.getBounds().width;
    const entityHeight = entityDisplayObject.getBounds().height;

    const xAdjust = (entityWidth - context.tileWidth) / 2;
    const yAdjust = (entityHeight - context.tileHeight) / 2;

    entityDisplayObject.x = x - xAdjust;
    entityDisplayObject.y = y - yAdjust;
  }
}
