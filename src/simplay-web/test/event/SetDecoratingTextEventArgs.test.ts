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
      new SetDecoratingTextEventArgs({ some: 'thing' } as any);
    }).to.throw();
  });
});
