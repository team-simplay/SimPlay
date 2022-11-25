import { EventArgs } from './EventArgs';

export class SetDecoratingTextEventArgs extends EventArgs {
  readonly text: string;

  constructor(args: { text: string }) {
    super(args);
    this.text = args.text;
  }

  getPropertyNames(): string[] {
    return ['text'];
  }
}
