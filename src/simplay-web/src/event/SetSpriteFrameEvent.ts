import { SetSpriteFrameEventArgs } from './SetSpriteFrameEventArgs';
import { Event } from './Event';
import { EventAction } from './EventAction';

export class SetSpriteFrameEvent extends Event {
  constructor(
    forId: string,
    timestamp: number,
    public readonly args: SetSpriteFrameEventArgs
  ) {
    super(forId, timestamp, EventAction.SET_SPRITE_FRAME, args);
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
