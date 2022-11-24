import { EventArgs } from './EventArgs';

export class StoreSetContentEventArgs extends EventArgs {
  content: {
    resourceId: number;
    amount: number;
  }[];

  constructor(args: { content: { resourceId: number; amount: number }[] }) {
    super(args);
    this.content = args.content;
  }

  getPropertyNames(): string[] {
    return ['content'];
  }
}
