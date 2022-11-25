import { SetTintColorEvent } from '../../src/event/SetTintColorEvent';
import { expect } from 'chai';
import { SetTintColorEventArgs } from '../../src/event/SetTintColorEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const color = 0x123456;

describe('SetTintColorEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new SetTintColorEventArgs({ color: color });
    const event = new SetTintColorEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_TINT_COLOR);
    expect(event.args.color).to.equal(color);
  });
});
