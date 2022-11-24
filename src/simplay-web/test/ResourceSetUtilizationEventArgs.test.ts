import { ResourceSetUtilizationEventArgs } from '../src/ResourceSetUtilizationEventArgs';
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
      new ResourceSetUtilizationEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
