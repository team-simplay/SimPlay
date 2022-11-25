import { SetNotInteractingEventArgs } from '../../src/event/SetNotInteractingEventArgs';
import { expect } from 'chai';

const withId = 'foo';

describe('SetNotInteractingEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetNotInteractingEventArgs({ withId: withId });
    expect(args.withId).to.equal(withId);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new SetNotInteractingEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
