import { getEntityDisplayObjectById } from '../Entity';
import { SimplayContext } from '../SimplayContext';
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
    const entityGraphic = getEntityDisplayObjectById(context, this.forId);
    entityGraphic.visible = this.args.visible;
  }
}
