import { EventArgs } from './EventArgs';

export class ContainerSetCapacityEventArgs extends EventArgs {
  capacity: number;

  constructor(args: { capacity: number }) {
    super(args);
    this.capacity = args.capacity;
  }

  getPropertyNames(): string[] {
    return ['capacity'];
  }
}
