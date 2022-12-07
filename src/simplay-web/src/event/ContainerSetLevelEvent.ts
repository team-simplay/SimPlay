import {
  ContainerEntity,
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
} from '../Entity';
import { SimplayContext } from '../SimplayContext';
import { ContainerSetLevelEventArgs } from './ContainerSetLevelEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ContainerSetLevelEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ContainerSetLevelEventArgs
  ) {
    super(forId, timestamp, EventAction.CONTAINER_SET_LEVEL, args);
  }
  execute(context: SimplayContext) {
    const entityDisplayObject = getEntityDisplayObjectById(
      context,
      this.forId
    ) as ExtendedDisplayEntity;
    const entity = context.simulationData.entities.find(
      (entity) => entity.id === this.forId
    ) as ContainerEntity;
    entity.level = this.args.level;
    entityDisplayObject.informationText.text = `${entity.level} / ${entity.capacity}`;
  }
}
