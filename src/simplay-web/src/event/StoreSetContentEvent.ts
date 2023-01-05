import { StoreSetContentEventArgs } from './StoreSetContentEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  StoreEntity,
} from '../Entity';

export class StoreSetContentEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetContentEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CONTENT, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as StoreEntity;
    entity.content = this.args.content;
    entityDisplayObject.informationText.text = `capacity: ${
      entity.capacity ?? 0
    }`;
    entityDisplayObject.informationText.text += `\n${entity.content}`;
    entityDisplayObject.informationText.text = entityDisplayObject.informationText.text.trim();
  }
}
