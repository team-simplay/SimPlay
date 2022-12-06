import { ResourceSetUtilizationEventArgs } from './ResourceSetUtilizationEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';
import { SimplayContext } from '../SimplayContext';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  ResourceEntity,
} from '../Entity';

export class ResourceSetUtilizationEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ResourceSetUtilizationEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_UTILIZATION, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as ResourceEntity;
    entity.utilization = this.args.utilization;
    entityDisplayObject.informationText.text = `${entity.utilization} / ${entity.capacity}`;
  }
}
