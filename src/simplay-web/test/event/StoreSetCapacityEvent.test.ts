import { StoreSetCapacityEvent } from '../../src/event/StoreSetCapacityEvent';
import { expect } from 'chai';
import { StoreSetCapacityEventArgs } from '../../src/event/StoreSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1854;

describe('StoreSetCapacityEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    const event = new StoreSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.STORE_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });
});
