import { SetDecoratingTextEventArgs } from './SetDecoratingTextEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class SetDecoratingTextEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetDecoratingTextEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_DECORATING_TEXT, args);
  }
  execute(context: SimplayContext) {
    const displayEntity = getEntityDisplayObjectById(context, this.forId);
    displayEntity.decoratingText.text = this.args.text;
  }
}
