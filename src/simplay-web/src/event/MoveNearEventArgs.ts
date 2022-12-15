import { EventArgs } from './EventArgs';

export class MoveNearEventArgs extends EventArgs {
  readonly targetId: string;

  constructor(args: { targetId: string }) {
    super(args);
    this.targetId = args.targetId;
  }

  getPropertyNames(): string[] {
    return ['targetId'];
  }
}
