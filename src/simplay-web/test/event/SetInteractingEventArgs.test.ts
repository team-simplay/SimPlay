import { SetInteractingEventArgs } from '../../src/event/SetInteractingEventArgs';
import { expect } from 'chai';

const withId = 'foo';
describe('SetInteractingEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetInteractingEventArgs({ withId: withId });
    expect(args.withId).to.equal(withId);
  });

  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetInteractingEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
