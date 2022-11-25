import { EventArgs } from './EventArgs';

export class ContainerSetLevelEventArgs extends EventArgs {
  readonly level: number;

  constructor(args: { level: number }) {
    super(args);
    this.level = args.level;
  }

  getPropertyNames(): string[] {
    return ['level'];
  }
}
