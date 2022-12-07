import { StoreSetCapacityEventArgs } from '../../src/event/StoreSetCapacityEventArgs';
import { expect } from 'chai';

const capacity = 123;

describe('StoreSetCapacityEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    expect(args.capacity).to.equal(capacity);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new StoreSetCapacityEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
