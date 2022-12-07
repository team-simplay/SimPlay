import { ResourceSetUtilizationEventArgs } from '../../src/event/ResourceSetUtilizationEventArgs';
import { expect } from 'chai';

const utilization = 0.5;

describe('ResourceSetUtilizationEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new ResourceSetUtilizationEventArgs({
      utilization: utilization,
    });
    expect(args.utilization).to.equal(utilization);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new ResourceSetUtilizationEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
