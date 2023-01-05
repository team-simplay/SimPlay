import { StoreSetCapacityEventArgs } from './StoreSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  StoreEntity,
} from '../Entity';

export class StoreSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: StoreSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.STORE_SET_CAPACITY, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as StoreEntity;
    entity.capacity = this.args.capacity;
    entityDisplayObject.informationText.text = `capacity: ${
      entity.capacity ?? 0
    }`;
    entityDisplayObject.informationText.text += `\n${entity.content}`;
    entityDisplayObject.informationText.text = entityDisplayObject.informationText.text.trim();
  }
}
