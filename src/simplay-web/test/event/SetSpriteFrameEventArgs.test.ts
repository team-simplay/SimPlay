import { SetSpriteFrameEventArgs } from '../../src/event/SetSpriteFrameEventArgs';
import { expect } from 'chai';

const frame = 9;

describe('SetSpriteFrameEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetSpriteFrameEventArgs({ frame: frame });
    expect(args.frame).to.equal(frame);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetSpriteFrameEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
