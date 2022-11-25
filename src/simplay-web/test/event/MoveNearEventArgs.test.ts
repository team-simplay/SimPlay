import { MoveNearEventArgs } from '../../src/event/MoveNearEventArgs';
import { expect } from 'chai';

const target = 'bar';

describe('MoveNearEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new MoveNearEventArgs({ target: target });
    expect(args.target).to.equal(target);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new MoveNearEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
