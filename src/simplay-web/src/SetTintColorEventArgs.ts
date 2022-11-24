import { EventArgs } from './EventArgs';

export class SetTintColorEventArgs extends EventArgs {
  color: number;

  constructor(args: { color: number }) {
    super(args);
    this.color = args.color;
  }

  getPropertyNames(): string[] {
    return ['color'];
  }
}
