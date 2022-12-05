import { SetTintColorEventArgs } from './SetTintColorEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class SetTintColorEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetTintColorEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_TINT_COLOR, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ).animatedSprite;
    // check color is valid for RGB
    if (this.args.color < 0x000000 || this.args.color > 0xffffff) {
      throw new Error(
        `Invalid color value ${this.args.color} for entity ${this.forId}`
      );
    }
    entityDisplayObject.tint = this.args.color;
  }
}
