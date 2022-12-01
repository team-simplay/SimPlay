import { SimplayContext } from '../SimplayContext';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SetVisibleEventArgs } from './SetVisibleEventArgs';

export class SetVisibleEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetVisibleEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_VISIBLE, args);
  }
  execute(context: SimplayContext) {
    const entityGraphic = context.entityContainer.getChildByName(this.forId);
    if (!entityGraphic) {
      throw new Error(`No entity found for id ${this.forId}`);
    }

    entityGraphic.visible = this.args.visible;
  }
}
