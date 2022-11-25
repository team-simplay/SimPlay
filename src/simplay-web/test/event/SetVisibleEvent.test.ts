import { SetVisibleEvent } from '../../src/event/SetVisibleEvent';
import { expect } from 'chai';
import { SetVisibleEventArgs } from '../../src/event/SetVisibleEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const visible = true;

describe('SetVisibleEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetVisibleEventArgs({ visible: visible });
    const event = new SetVisibleEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_VISIBLE);
    expect(event.args.visible).to.equal(visible);
  });
});
