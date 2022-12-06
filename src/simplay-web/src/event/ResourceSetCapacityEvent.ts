import { ResourceSetCapacityEventArgs } from './ResourceSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  ResourceEntity,
} from '../Entity';

export class ResourceSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ResourceSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_CAPACITY, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as ResourceEntity;
    entity.capacity = this.args.capacity;
    entityDisplayObject.informationText.text = `${entity.utilization} / ${entity.capacity}`;
  }
}
