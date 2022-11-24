import { EventAction } from './EventAction';


export interface EventSerialized {
  forId: string;
  timestamp: number;
  action: EventAction;
  args: Record<string, unknown>;
}
