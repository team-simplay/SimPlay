import { SetInteractingEventArgs } from './SetInteractingEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import { getEntityDisplayObjectById } from '../Entity';
import * as PIXI from 'pixi.js';
import { InteractionLine } from './InteractionLine';

export class SetInteractingEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetInteractingEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_INTERACTING, args);
  }
  execute(context: SimplayContext) {
    const sourceEntity = getEntityDisplayObjectById(context, this.forId);
    const targetEntity = getEntityDisplayObjectById(context, this.args.withId);
    if (sourceEntity.outgoingInteractions.get(this.args.withId)) {
      return;
    }
    const interaction = new InteractionLine(
      sourceEntity,
      targetEntity,
      context
    );
    sourceEntity.outgoingInteractions.set(this.args.withId, interaction);
    targetEntity.incomingInteractions.set(this.forId, interaction);
  }
}
