import { EventArgs } from './EventArgs';

export class SetVisibleEventArgs extends EventArgs {
  visible: boolean;

  constructor(args: { visible: boolean }) {
    super(args);
    this.visible = args.visible;
  }

  getPropertyNames(): string[] {
    return ['visible'];
  }
}
