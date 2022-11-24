import { ContainerSetLevelEventArgs } from '../src/ContainerSetLevelEventArgs';
import { expect } from 'chai';

const level = 9;

describe('ContainerSetLevelEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    expect(args.level).to.equal(level);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new ContainerSetLevelEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
