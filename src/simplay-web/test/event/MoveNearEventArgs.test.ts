import { MoveNearEventArgs } from '../../src/event/MoveNearEventArgs';
import { expect } from 'chai';

const targetId = 'bar';

describe('MoveNearEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new MoveNearEventArgs({ targetId: targetId });
    expect(args.targetId).to.equal(targetId);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new MoveNearEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
