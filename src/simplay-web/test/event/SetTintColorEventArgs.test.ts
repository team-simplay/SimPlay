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
      new SetTintColorEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
