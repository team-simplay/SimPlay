import { ResourceSetUtilizationEventArgs } from './ResourceSetUtilizationEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ResourceSetUtilizationEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: ResourceSetUtilizationEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_UTILIZATION, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
