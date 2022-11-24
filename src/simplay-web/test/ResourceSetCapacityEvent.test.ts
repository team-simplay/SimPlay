import { ResourceSetCapacityEvent } from '../src/ResourceSetCapacityEvent';
import { expect } from 'chai';
import { ResourceSetCapacityEventArgs } from '../src/ResourceSetCapacityEventArgs';
import { EventAction } from '../src/EventAction';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1492;

describe('ResourceSetCapacityEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    const event = new ResourceSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.RESOURCE_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });
});
