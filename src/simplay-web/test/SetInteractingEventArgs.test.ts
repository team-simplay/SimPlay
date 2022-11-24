import { SetInteractingEventArgs } from '../src/SetInteractingEventArgs';
import { expect } from 'chai';

const withId = 'foo';
describe('SetInteractingEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetInteractingEventArgs({ withId: withId });
    expect(args.withId).to.equal(withId);
  });

  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new SetInteractingEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
