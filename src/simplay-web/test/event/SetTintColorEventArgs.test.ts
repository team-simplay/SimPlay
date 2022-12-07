import { SetTintColorEventArgs } from '../../src/event/SetTintColorEventArgs';
import { expect } from 'chai';

const color = 0x123456;

describe('SetTintColorEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetTintColorEventArgs({ color: color });
    expect(args.color).to.equal(color);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetTintColorEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
