import { SetSpriteFrameEventArgs } from './SetSpriteFrameEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class SetSpriteFrameEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetSpriteFrameEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_SPRITE_FRAME, args);
  }
  execute(context: SimplayContext) {
    const entityAnimatedSprite = getEntityDisplayObjectById(
      context,
      this.forId
    ).animatedSprite;
    if (entityAnimatedSprite.textures.length <= this.args.frame) {
      throw new Error(
        `Frame ${this.args.frame} does not exist for entity ${this.forId}`
      );
    }
    entityAnimatedSprite.gotoAndStop(this.args.frame);
  }
}
