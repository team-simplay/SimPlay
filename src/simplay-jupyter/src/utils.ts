export function createIconSpan(svgIconString: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.classList.add('simplay-icon');
  span.innerHTML = svgIconString;
  return span;
}

export function createButton(
  icon: HTMLSpanElement,
  classes: string[]
): HTMLButtonElement {
  const button = document.createElement('button');
  button.appendChild(icon);
  classes.forEach(className => button.classList.add(className));
  return button;
}
