import { EventAction } from './EventAction';
import { EventArgs } from './EventArgs';

export abstract class Event {
  readonly forId: string;
  readonly timestamp: number;
  readonly action: EventAction;
  readonly args: EventArgs;

  constructor(
    forId: string,
    timestamp: number,
    action: EventAction,
    args: EventArgs
  ) {
    this.forId = forId;
    this.timestamp = timestamp;
    this.action = action;
    this.args = args;
  }

  abstract execute(context: any): void;
}
