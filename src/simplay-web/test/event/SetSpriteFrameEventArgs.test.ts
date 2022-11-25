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
      new SetSpriteFrameEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
