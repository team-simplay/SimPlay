import { ResourceSetCapacityEvent } from '../../src/event/ResourceSetCapacityEvent';
import { expect } from 'chai';
import { ResourceSetCapacityEventArgs } from '../../src/event/ResourceSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1492;

describe('ResourceSetCapacityEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    const event = new ResourceSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.RESOURCE_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });
});
