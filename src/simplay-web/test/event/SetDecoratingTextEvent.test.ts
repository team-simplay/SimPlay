import { SetDecoratingTextEvent } from '../../src/event/SetDecoratingTextEvent';
import { expect } from 'chai';
import { SetDecoratingTextEventArgs } from '../../src/event/SetDecoratingTextEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const text = 'baz';

describe('SetDecoratingTextEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetDecoratingTextEventArgs({ text: text });
    const event = new SetDecoratingTextEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_DECORATING_TEXT);
    expect(event.args.text).to.equal(text);
  });
});
