import { ContainerSetLevelEvent } from '../src/ContainerSetLevelEvent';
import { expect } from 'chai';
import { ContainerSetLevelEventArgs } from '../src/ContainerSetLevelEventArgs';
import { EventAction } from '../src/EventAction';

const forId = 'leet';
const timestamp = 1337;
const level = 1848;

describe('ContainerSetLevelEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    const event = new ContainerSetLevelEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.CONTAINER_SET_LEVEL);
    expect(event.args.level).to.equal(level);
  });
});
