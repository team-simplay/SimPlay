import { SetVisibleEventArgs } from '../../src/event/SetVisibleEventArgs';
import { expect } from 'chai';

describe('SetVisibleEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetVisibleEventArgs({ visible: true });
    expect(args.visible).to.be.true;
  });
  it('should initialize correctly with false', () => {
    const args = new SetVisibleEventArgs({ visible: false });
    expect(args.visible).to.be.false;
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetVisibleEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
