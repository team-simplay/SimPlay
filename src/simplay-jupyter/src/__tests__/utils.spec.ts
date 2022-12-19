import { createButton, createIconSpan } from '../utils';

describe('Utils tests', () => {
  it('should create a button', () => {
    let icon = document.createElement('span');
    const className = 'clazz';
    const button = createButton(icon, [className]);
    expect(button).toBeDefined();
    expect(button.children.item(0)).toBe(icon);
    expect(button.classList).toContain(className);
  });
  it('should create icon span', () => {
    const svg = 'svg';
    const iconSpan = createIconSpan(svg);
    expect(iconSpan.innerHTML).toBe(svg);
    expect(iconSpan.classList).toContain('simplay-icon');
  });
});
