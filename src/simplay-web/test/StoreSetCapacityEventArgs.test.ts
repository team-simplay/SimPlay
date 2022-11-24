import { StoreSetCapacityEventArgs } from '../src/StoreSetCapacityEventArgs';
import { expect } from 'chai';

const capacity = 123;

describe('StoreSetCapacityEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    expect(args.capacity).to.equal(capacity);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new StoreSetCapacityEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
