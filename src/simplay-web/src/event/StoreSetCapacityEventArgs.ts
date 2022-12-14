import { EventArgs } from './EventArgs';

export class StoreSetCapacityEventArgs extends EventArgs {
  readonly capacity: number;

  constructor(args: { capacity: number }) {
    super(args);
    this.capacity = args.capacity;
  }

  getPropertyNames(): string[] {
    return ['capacity'];
  }
}
