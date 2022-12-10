import { MoveNearCellEventArgs } from '../../src/event/MoveNearCellEventArgs';
import { expect } from 'chai';

const x = 1291;
const y = 187;

describe('MoveNearCellEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new MoveNearCellEventArgs({ x: x, y: y });
    expect(args.x).to.equal(x);
    expect(args.y).to.equal(y);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new MoveNearCellEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
