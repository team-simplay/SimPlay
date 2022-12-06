import {
  ContainerEntity,
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
} from '../Entity';
import { SimplayContext } from '../SimplayContext';
import { ContainerSetCapacityEventArgs } from './ContainerSetCapacityEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ContainerSetCapacityEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ContainerSetCapacityEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_CAPACITY, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as ContainerEntity;
    entity.capacity = this.args.capacity;
    entityDisplayObject.informationText.text = `${entity.level} / ${entity.capacity}`;
  }
}
