import { SetVisibleEventArgs } from '../src/SetVisibleEventArgs';
import { expect } from 'chai';

describe('SetVisibleEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetVisibleEventArgs({ visible: true });
    expect(args.visible).to.be.true;
  });
  it('should initialize correctly with false', () => {
    const args = new SetVisibleEventArgs({ visible: false });
    expect(args.visible).to.be.false;
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new SetVisibleEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
