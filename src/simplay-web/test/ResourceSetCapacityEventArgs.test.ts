import { ResourceSetCapacityEventArgs } from '../src/ResourceSetCapacityEventArgs';
import { expect } from 'chai';

const capacity = 123;

describe('ResourceSetCapacityEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    expect(args.capacity).to.equal(capacity);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new ResourceSetCapacityEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
