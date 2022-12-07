import { SetNotInteractingEventArgs } from './SetNotInteractingEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';

export class SetNotInteractingEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetNotInteractingEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_NOT_INTERACTING, args);
  }
  execute(context: SimplayContext) {
    const sourceEntity = getEntityDisplayObjectById(context, this.forId);
    const targetEntity = getEntityDisplayObjectById(context, this.args.withId);
    const interaction = sourceEntity.outgoingInteractions.get(this.args.withId);
    if (!interaction) {
      return;
    }
    sourceEntity.outgoingInteractions.delete(this.args.withId);
    targetEntity.incomingInteractions.delete(this.forId);
    interaction.destroy();
  }
}
