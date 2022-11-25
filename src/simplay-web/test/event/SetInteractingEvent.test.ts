import { SetInteractingEvent } from '../../src/event/SetInteractingEvent';
import { expect } from 'chai';
import { SetInteractingEventArgs } from '../../src/event/SetInteractingEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const withId = 'foo';

describe('SetInteractingEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetInteractingEventArgs({ withId: withId });
    const event = new SetInteractingEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_INTERACTING);
    expect(event.args.withId).to.equal(args.withId);
  });
});
