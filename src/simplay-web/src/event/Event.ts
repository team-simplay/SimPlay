import { EventAction } from './EventAction';
import { EventArgs } from './EventArgs';

export abstract class Event {
  constructor(
    public readonly forId: string,
    public readonly timestamp: number,
    public readonly action: EventAction,
    public readonly args: EventArgs
  ) {}

  abstract execute(context: any): void;
}
