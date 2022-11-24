import { SetSpriteFrameEventArgs } from "./SetSpriteFrameEventArgs";
import { Event } from "./Event";
import { EventAction } from "./EventAction";


export class SetSpriteFrameEvent extends Event {
  args: SetSpriteFrameEventArgs;
  constructor(forId: string, timestamp: number, args: SetSpriteFrameEventArgs) {
    super(forId, timestamp, EventAction.SET_SPRITE_FRAME, args);
    this.args = args;
  }
  execute(context: any) {
    throw new Error('Method not implemented.');
  }
}
