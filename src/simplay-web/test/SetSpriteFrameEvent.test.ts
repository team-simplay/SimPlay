import { SetSpriteFrameEvent } from '../src/SetSpriteFrameEvent';
import { expect } from 'chai';
import { SetSpriteFrameEventArgs } from '../src/SetSpriteFrameEventArgs';
import { EventAction } from '../src/EventAction';

const forId = 'leet';
const timestamp = 1337;
const frame = 9;

describe('SetSpriteFrameEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new SetSpriteFrameEventArgs({ frame: frame });
    const event = new SetSpriteFrameEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_SPRITE_FRAME);
    expect(event.args.frame).to.equal(frame);
  });
});
