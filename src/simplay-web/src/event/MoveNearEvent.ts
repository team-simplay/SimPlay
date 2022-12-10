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
    // Math.random() - 0.5 is used to get random position on the circumference of the circle around the center of the cell
    const x =
      targetDisplayObject.container.x +
      (Math.random() - 0.5) * context.tileWidth;
    const y =
      targetDisplayObject.container.y +
      (Math.random() - 0.5) * context.tileHeight;

    const entityWidth = entityDisplayObject.container.getBounds().width;
    const entityHeight = entityDisplayObject.container.getBounds().height;

    // the adjust variables are used to center the entity on the circumference of the circle, not the top left corner of the entity
    const xAdjust = (entityWidth - context.tileWidth) / 2;
    const yAdjust = (entityHeight - context.tileHeight) / 2;

    entityDisplayObject.container.x = x - xAdjust;
    entityDisplayObject.container.y = y - yAdjust;
  }
}
