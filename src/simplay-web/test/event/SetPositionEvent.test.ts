import { SetPositionEvent } from '../../src/event/SetPositionEvent';
import { expect } from 'chai';
import { SetPositionEventArgs } from '../../src/event/SetPositionEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;

describe('SetPositionEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new SetPositionEventArgs({ x: 0, y: 0 });
    const event = new SetPositionEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_POSITION);
    expect(event.args.x).to.equal(0);
    expect(event.args.y).to.equal(0);
  });
});
