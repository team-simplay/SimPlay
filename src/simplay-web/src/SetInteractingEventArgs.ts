import { EventArgs } from './EventArgs';

export class SetInteractingEventArgs extends EventArgs {
  withId: string;

  constructor(args: { withId: string }) {
    super(args);
    this.withId = args.withId;
  }

  getPropertyNames(): string[] {
    return ['withId'];
  }
}
