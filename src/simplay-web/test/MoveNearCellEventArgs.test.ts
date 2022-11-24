import { MoveNearCellEventArgs } from '../src/MoveNearCellEventArgs';
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
      new MoveNearCellEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
