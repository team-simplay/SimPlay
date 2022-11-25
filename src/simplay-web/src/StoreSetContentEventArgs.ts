import { EventArgs } from './EventArgs';

export type StoreContentItem = {
  resourceId: number;
  amount: number;
};

export class StoreSetContentEventArgs extends EventArgs {
  readonly content: StoreContentItem[];

  constructor(args: { content: { resourceId: number; amount: number }[] }) {
    super(args);
    this.content = args.content;
  }

  getPropertyNames(): string[] {
    return ['content'];
  }
}
