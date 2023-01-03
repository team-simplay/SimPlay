import { tsToTime } from './utils';

export class StepInfo {
  public static STEP_MODE = 'step';
  public static TIME_MODE = 'time';

  private mode: string;
  private currentStep: number;
  private totalSteps: number;
  private element: HTMLParagraphElement;
  private modeListeners: ((mode: string) => void)[] = [];

  constructor(currentStep: number, totalSteps: number) {
    this.mode = StepInfo.STEP_MODE;
    this.currentStep = currentStep;
    this.totalSteps = totalSteps;

    this.element = document.createElement('p') as HTMLParagraphElement;
    this.element.addEventListener('click', () => {
      if (this.mode === StepInfo.TIME_MODE) {
        this.changeMode(StepInfo.STEP_MODE);
      } else {
        this.changeMode(StepInfo.TIME_MODE);
      }
      this.updateCurrentStep();
      this.updateTotalSteps();
    });
    this.updateCurrentStep();
    this.updateTotalSteps();
  }

  private updateCurrentStep(): void {
    this.setCurrentStep(this.currentStep);
  }

  private updateTotalSteps(): void {
    this.setTotalSteps(this.totalSteps);
  }

  public setCurrentStep(step: number): void {
    this.currentStep = step;
    if (this.mode === StepInfo.TIME_MODE) {
      this.element.innerHTML = this.buildElementContent(
        tsToTime(step),
        tsToTime(this.totalSteps)
      );
    } else {
      this.element.innerHTML = this.buildElementContent(
        Math.round(step).toString(),
        Math.round(this.totalSteps).toString()
      );
    }
  }

  private buildElementContent(current: string, total: string) {
    return `${current} / ${total}`;
  }

  public setTotalSteps(step: number): void {
    this.totalSteps = step;
    if (this.mode === StepInfo.TIME_MODE) {
      this.element.innerHTML = this.buildElementContent(
        tsToTime(this.currentStep),
        tsToTime(step)
      );
    } else {
      this.element.innerHTML = this.buildElementContent(
        Math.round(this.currentStep).toString(),
        Math.round(step).toString()
      );
    }
  }

  public changeMode(mode: string): void {
    this.mode = mode;
    this.modeListeners.map(func => func(this.mode));
    this.updateCurrentStep();
    this.updateTotalSteps();
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
    this.element.classList.add('simplay-step-info');
    this.element.classList.add('simplay-label');
    return this.element;
  }
}
