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

export function tsToTime(ts: number): string {
  let minutes = Math.trunc(ts / 60);
  const seconds = ts - 60 * minutes;
  const roundedSeconds =
    seconds > 59.5 ? Math.trunc(seconds) : Math.round(seconds);
  if (minutes >= 60) {
    const hours = Math.trunc(minutes / 60);
    minutes = minutes - 60 * hours;
    return enhanceFullTimeStringWithZeros(hours, minutes, roundedSeconds);
  }
  return enhanceMinutesSecondsTimeStringWithZeros(minutes, roundedSeconds);
}

function enhanceMinutesSecondsTimeStringWithZeros(
  minutes: number,
  seconds: number
) {
  const minutesString = enhanceWithZero(minutes);
  const secondsString = enhanceWithZero(seconds);

  return `${minutesString}:${secondsString}`;
}

function enhanceFullTimeStringWithZeros(
  hours: number,
  minutes: number,
  seconds: number
) {
  const hoursString = enhanceWithZero(hours);
  const minutesString = enhanceWithZero(minutes);
  const secondsString = enhanceWithZero(seconds);

  return `${hoursString}:${minutesString}:${secondsString}`;
}

function enhanceWithZero(time: number) {
  if (time < 10) {
    return '0' + time;
  }
  return time;
}

export class ControlHandler {
  public state = 'enabled';
  private disableCallbacks: (() => void)[] = [];
  attachDisable(callback: () => void): void {
    this.disableCallbacks.push(callback);
  }
  disable(): void {
    this.state = 'disabled';
    this.disableCallbacks.map(callback => {
      callback();
    });
  }

  private enableCallbacks: (() => void)[] = [];
  attachEnable(callback: () => void): void {
    this.enableCallbacks.push(callback);
  }
  enable(): void {
    this.state = 'enabled';
    this.enableCallbacks.map(callback => {
      callback();
    });
  }
}
