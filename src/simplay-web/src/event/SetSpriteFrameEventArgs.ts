import { EventArgs } from './EventArgs';

export class SetSpriteFrameEventArgs extends EventArgs {
  readonly frame: number;

  constructor(args: { frame: number }) {
    super(args);
    this.frame = args.frame;
  }

  getPropertyNames(): string[] {
    return ['frame'];
  }
}
