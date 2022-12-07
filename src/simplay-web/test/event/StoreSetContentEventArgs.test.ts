import { StoreSetContentEventArgs } from '../../src/event/StoreSetContentEventArgs';
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
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new StoreSetContentEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
