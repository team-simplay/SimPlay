import { ContainerSetLevelEventArgs } from '../../src/event/ContainerSetLevelEventArgs';
import { expect } from 'chai';

const level = 9;

describe('ContainerSetLevelEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    expect(args.level).to.equal(level);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new ContainerSetLevelEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
