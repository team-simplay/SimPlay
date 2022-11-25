import { SetNotInteractingEvent } from '../src/SetNotInteractingEvent';
import { expect } from 'chai';
import { SetNotInteractingEventArgs } from '../src/SetNotInteractingEventArgs';
import { EventAction } from '../src/EventAction';

const forId = 'leet';
const timestamp = 1337;
const withId = 'foo';

describe('SetNotInteractingEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetNotInteractingEventArgs({ withId: withId });
    const event = new SetNotInteractingEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_NOT_INTERACTING);
    expect(event.args.withId).to.equal(withId);
  });
});
