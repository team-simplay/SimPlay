/* istanbul ignore file */
export class CustomResizeObserver {
  private callback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  public disconnect() {}
  public observe() {
    this.callback([], this);
  }
  public unobserve() {}
}

export function makeCustomResizeObseverGloballyAvailable() {
  globalThis.ResizeObserver = CustomResizeObserver;
}
