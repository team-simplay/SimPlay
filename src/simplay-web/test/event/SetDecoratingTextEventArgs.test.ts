import { SetDecoratingTextEventArgs } from '../../src/event/SetDecoratingTextEventArgs';
import { expect } from 'chai';

const text = 'baz';

describe('SetDecoratingTextEventArgs tests', function () {
  it('should initialize correctly', () => {
    const args = new SetDecoratingTextEventArgs({ text: text });
    expect(args.text).to.equal(text);
  });
  it('should raise an error when initializing with wrong args', () => {
    expect(() => {
      // the eslint-disable is used because the constructor of these EventArgs classes
      // is (usually) not called directly, but rather through a generic factory method
      // thus, testing the throw is not possible without casting to any, but neverthless
      // interesting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new SetDecoratingTextEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
