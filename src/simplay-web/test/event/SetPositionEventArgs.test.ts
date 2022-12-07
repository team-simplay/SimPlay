import { SetPositionEventArgs } from '../../src/event/SetPositionEventArgs';
import { expect } from 'chai';

describe('SetPositionEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetPositionEventArgs({ x: 0, y: 0 });
    expect(args.x).to.equal(0);
    expect(args.y).to.equal(0);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetPositionEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
