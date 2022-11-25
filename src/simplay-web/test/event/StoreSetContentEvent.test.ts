import { StoreSetContentEvent } from '../../src/event/StoreSetContentEvent';
import { expect } from 'chai';
import { StoreSetContentEventArgs } from '../../src/event/StoreSetContentEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const content = [{ resourceId: 98, amount: 76 }];

describe('StoreSetContentEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new StoreSetContentEventArgs({ content: content });
    const event = new StoreSetContentEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.STORE_SET_CONTENT);
    expect(event.args.content).to.equal(content);
  });
});
