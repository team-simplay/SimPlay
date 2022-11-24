import { MoveNearCellEvent } from '../src/MoveNearCellEvent';
import { expect } from 'chai';
import { MoveNearCellEventArgs } from '../src/MoveNearCellEventArgs';
import { EventAction } from '../src/EventAction';

const forId = 'leet';
const timestamp = 1337;
const x = 1291;
const y = 187;

describe('MoveNearCellEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new MoveNearCellEventArgs({ x: x, y: y });
    const event = new MoveNearCellEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.MOVE_NEAR_CELL);
    expect(event.args.x).to.equal(x);
    expect(event.args.y).to.equal(y);
  });
});
