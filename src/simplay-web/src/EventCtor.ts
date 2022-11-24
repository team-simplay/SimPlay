import { Event } from './Event';


export type EventCtor<U extends Event> = new (
  forId: string,
  timestamp: number,
  args: U['args']
) => U;
