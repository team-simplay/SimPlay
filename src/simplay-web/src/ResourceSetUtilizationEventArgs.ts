import { EventArgs } from './EventArgs';

export class ResourceSetUtilizationEventArgs extends EventArgs {
  readonly utilization: number;

  constructor(args: { utilization: number }) {
    super(args);
    this.utilization = args.utilization;
  }

  getPropertyNames(): string[] {
    return ['utilization'];
  }
}
