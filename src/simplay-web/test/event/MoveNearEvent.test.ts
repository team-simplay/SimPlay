import { MoveNearEvent } from '../../src/event/MoveNearEvent';
import { expect } from 'chai';
import { MoveNearEventArgs } from '../../src/event/MoveNearEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const target = 'bar';

describe('MoveNearEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new MoveNearEventArgs({ target: target });
    const event = new MoveNearEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.MOVE_NEAR);
    expect(event.args.target).to.equal(target);
  });
});
