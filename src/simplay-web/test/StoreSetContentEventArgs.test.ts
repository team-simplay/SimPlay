import { StoreSetContentEventArgs } from '../src/StoreSetContentEventArgs';
import { expect } from 'chai';

const content = [
  { resourceId: 12, amount: 34 },
  { resourceId: 56, amount: 78 },
];

describe('StoreSetContentEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new StoreSetContentEventArgs({ content: content });
    expect(args.content).to.equal(content);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      new StoreSetContentEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
