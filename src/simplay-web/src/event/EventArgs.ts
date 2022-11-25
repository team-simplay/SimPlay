export abstract class EventArgs {
  constructor(args: Record<string, unknown>) {
    if (!this.validate(args)) {
      throw new Error(`Invalid args for event ${this.constructor.name}`);
    }
  }

  abstract getPropertyNames(): string[];

  validate(args: Record<string, unknown>): boolean {
    const props = this.getPropertyNames();
    for (const prop of props) {
      if (args[prop] === undefined || args[prop] === null) {
        return false;
      }
    }
    return true;
  }
}
