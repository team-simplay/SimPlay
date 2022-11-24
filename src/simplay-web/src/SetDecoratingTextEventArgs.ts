import { EventArgs } from './EventArgs';

export class SetDecoratingTextEventArgs extends EventArgs {
  text: string;

  constructor(args: { text: string }) {
    super(args);
    this.text = args.text;
  }

  getPropertyNames(): string[] {
    return ['text'];
  }
}
