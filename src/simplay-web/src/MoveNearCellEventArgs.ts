import { EventArgs } from './EventArgs';

export class MoveNearCellEventArgs extends EventArgs {
  readonly x: number;
  readonly y: number;

  constructor(args: { x: number; y: number }) {
    super(args);
    this.x = args.x;
    this.y = args.y;
  }

  getPropertyNames(): string[] {
    return ['x', 'y'];
  }
}
