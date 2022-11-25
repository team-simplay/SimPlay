import { ContainerSetCapacityEvent } from '../../src/event/ContainerSetCapacityEvent';
import { expect } from 'chai';
import { ContainerSetCapacityEventArgs } from '../../src/event/ContainerSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1848;

describe('ContainerSetCapacityEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: capacity });
    const event = new ContainerSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.CONTAINER_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });
});
