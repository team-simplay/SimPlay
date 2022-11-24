import { ResourceSetUtilizationEventArgs } from './ResourceSetUtilizationEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class ResourceSetUtilizationEvent extends Event {
  readonly args: ResourceSetUtilizationEventArgs;
  constructor(
    forId: string,
    timestamp: number,
    args: ResourceSetUtilizationEventArgs
  ) {
    super(forId, timestamp, EventAction.RESOURCE_SET_UTILIZATION, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
