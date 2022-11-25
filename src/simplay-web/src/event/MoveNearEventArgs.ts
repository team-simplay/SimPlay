import { EventArgs } from './EventArgs';

export class MoveNearEventArgs extends EventArgs {
  readonly target: string;

  constructor(args: { target: string }) {
    super(args);
    this.target = args.target;
  }

  getPropertyNames(): string[] {
    return ['target'];
  }
}
