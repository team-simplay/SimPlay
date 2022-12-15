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
      this.args.targetId
    );
    const targetEntityCenterX =
      targetDisplayObject.container.x +
      targetDisplayObject.animatedSprite.width / 2;
    const targetEntityCenterY =
      targetDisplayObject.container.y +
      targetDisplayObject.animatedSprite.height / 2;

    const maxDistanceX = targetDisplayObject.animatedSprite.width;
    const maxDistanceY = targetDisplayObject.animatedSprite.height;
    const offsetX = (Math.random() - 0.5) * 2 * maxDistanceX;
    const offsetY = (Math.random() - 0.5) * 2 * maxDistanceY;
    const targetX = targetEntityCenterX + offsetX;
    const targetY = targetEntityCenterY + offsetY;
    entityDisplayObject.container.x =
      targetX - entityDisplayObject.animatedSprite.width / 2;
    entityDisplayObject.container.y =
      targetY - entityDisplayObject.animatedSprite.height / 2;
  }
}
