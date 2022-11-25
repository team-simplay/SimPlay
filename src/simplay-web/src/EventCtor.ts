import { Event } from './Event';

export type EventCtor<T extends Event> = new (
  forId: string,
  timestamp: number,
  args: T['args']
) => T;
