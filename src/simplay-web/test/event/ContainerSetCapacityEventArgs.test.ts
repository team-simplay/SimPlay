import { ContainerSetCapacityEventArgs } from '../../src/event/ContainerSetCapacityEventArgs';
import { expect } from 'chai';

const capacity = 9;

describe('ContainerSetCapacityEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: capacity });
    expect(args.capacity).to.equal(capacity);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new ContainerSetCapacityEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
