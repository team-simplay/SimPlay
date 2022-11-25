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
      new SetPositionEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
