import { tsToTime } from './utils';

export class StepInfo {
  public static STEP_MODE = 'step';
  public static TIME_MODE = 'time';

  private mode: string;
  private _formatValueDelegate: (value: number) => string = (value: number) =>
    Math.round(value).toString();
  private element: HTMLParagraphElement;
  private modeListeners: ((mode: string) => void)[] = [];

  get formatValueDelegate(): (value: number) => string {
    return this._formatValueDelegate;
  }

  get currentStep(): number {
    return this._currentStep;
  }

  set currentStep(value: number) {
    this._currentStep = value;
    this.updateStepDisplay();
  }

  get totalSteps(): number {
    return this._totalSteps;
  }

  set totalSteps(value: number) {
    this._totalSteps = value;
    this.updateStepDisplay();
  }

  constructor(
    id: string,
    private _currentStep: number,
    private _totalSteps: number
  ) {
    this.mode = StepInfo.STEP_MODE;

    this.element = document.createElement('p') as HTMLParagraphElement;
    this.element.id = id;
    this.element.addEventListener('click', () => {
      if (this.mode === StepInfo.TIME_MODE) {
        this.changeMode(StepInfo.STEP_MODE);
      } else {
        this.changeMode(StepInfo.TIME_MODE);
      }
      this.updateStepDisplay();
    });
    this.updateStepDisplay();
  }

  private updateStepDisplay(): void {
    this.element.innerHTML = this.buildElementContent();
  }

  private buildElementContent() {
    const current = this.formatValueDelegate(this.currentStep);
    const total = this.formatValueDelegate(this.totalSteps);
    return `${current} / ${total}`;
  }

  public changeMode(mode: string): void {
    this.mode = mode;
    this._formatValueDelegate =
      mode === StepInfo.TIME_MODE
        ? tsToTime
        : (value: number) => Math.round(value).toString();
    this.modeListeners.map(func => func(this.mode));
    this.updateStepDisplay();
  }

  public addModeListener(modeListenerFunction: (mode: string) => void): void {
    this.modeListeners.push(modeListenerFunction);
  }

  public removeModeListener(listener: (mode: string) => void): void {
    const index = this.modeListeners.indexOf(listener);
    if (index >= 0) {
      this.modeListeners.splice(index, 1);
    }
  }

  public render(): HTMLParagraphElement {
    this.element.style.cursor = 'pointer';
    this.element.style.flexGrow = '0';
    this.element.style.textAlign = 'center';
    this.element.style.alignSelf = 'center';
    return this.element;
  }
}
