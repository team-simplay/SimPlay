import { EventArgs } from './EventArgs';

export class StoreSetContentEventArgs extends EventArgs {
  readonly content: string;

  constructor(args: { content: string }) {
    super(args);
    this.content = args.content;
  }

  getPropertyNames(): string[] {
    return ['content'];
  }
}
