export class AccurateSlider {
  private static PADDING = 2;
  private static LEFTSEGEMENTCOLOR = '#55b3b3';
  private static RIGHTSEGEMENTCOLOR = '#e6e6e6';
  private static DEFAULTHEIGHT = 10;

  private mousedown = false;

  public slider: HTMLDivElement;
  public readonly leftSegment: SliderSegment;
  public readonly rightSegment: SliderSegment;

  private _lastClickedValue = 0;

  private set lastClickedValue(value: number) {
    this._lastClickedValue = Math.round(value);
  }

  private get lastClickedValue(): number {
    return this._lastClickedValue;
  }

  private onValueChangedListeners: ((value: number) => void)[] = [];
  private onStagedValueChangedListeners: ((value: number) => void)[] = [];
  private onHoverPositionChangesListeners: ((value: number) => void)[] = [];

  public addOnValueChangedListener(listener: (value: number) => void): void {
    this.onValueChangedListeners.push(listener);
  }

  public removeOnValueChangedListener(listener: (value: number) => void): void {
    const index = this.onValueChangedListeners.indexOf(listener);
    if (index >= 0) {
      this.onValueChangedListeners.splice(index, 1);
    }
  }

  public addOnStagedValueChangedListener(
    listener: (value: number) => void
  ): void {
    this.onStagedValueChangedListeners.push(listener);
  }

  public removeOnStagedValueChangedListener(
    listener: (value: number) => void
  ): void {
    const index = this.onStagedValueChangedListeners.indexOf(listener);
    if (index >= 0) {
      this.onStagedValueChangedListeners.splice(index, 1);
    }
  }

  public addOnHoverPositionChangedListener(
    listener: (value: number) => void
  ): void {
    this.onHoverPositionChangesListeners.push(listener);
  }

  public removeOnHoverPositionChangedListener(
    listener: (value: number) => void
  ): void {
    const index = this.onHoverPositionChangesListeners.indexOf(listener);
    if (index >= 0) {
      this.onHoverPositionChangesListeners.splice(index, 1);
    }
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
    this.slider.id = id;
  }

  get minVal(): number {
    return this._minVal;
  }

  set minVal(minVal: number) {
    if (minVal >= this.maxVal) {
      throw new Error('minVal must be smaller than maxVal');
    }
    if (minVal <= 0) {
      throw new Error('minVal must be greater than or equal to 0');
    }
    this._minVal = minVal;
    this.updateVisual();
  }

  get maxVal(): number {
    return this._maxVal;
  }

  set maxVal(maxVal: number) {
    if (maxVal <= this.minVal) {
      throw new Error('maxVal must be greater than minVal');
    }
    this._maxVal = maxVal;
    this.updateVisual();
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = Math.max(
      Math.min(Math.round(value), this.maxVal),
      this.minVal
    );
    this.onStagedValueChangedListeners.forEach(listener =>
      listener(this._value)
    );
    this.updateVisual();
  }

  notifyUpdateValue(value: number): void {
    this.value = value;
    this.onValueChangedListeners.forEach(listener => listener(value));
  }

  get heigth(): number {
    return this._heigth;
  }

  set heigth(heigth: number) {
    this._heigth = heigth;
    this.slider.style.height = heigth + 'px';
  }

  constructor(
    private _id: string,
    private _minVal: number,
    private _maxVal: number,
    private _value = 0,
    private _heigth = AccurateSlider.DEFAULTHEIGHT,
    leftSegmentColor = AccurateSlider.LEFTSEGEMENTCOLOR,
    rightSegmentColor = AccurateSlider.RIGHTSEGEMENTCOLOR
  ) {
    if (_minVal >= _maxVal) {
      throw new Error('minVal must be smaller than maxVal');
    }
    if (_minVal < 0) {
      throw new Error('minVal must be greater than or equal to 0');
    }
    if (_value < _minVal || _value > _maxVal) {
      throw new Error('value must be between minVal and maxVal');
    }

    this.slider = this.createRoot();
    this.leftSegment = new SliderSegment(leftSegmentColor);
    this.leftSegment.segment.style.left = '0';
    this.rightSegment = new SliderSegment(rightSegmentColor);
    this.rightSegment.segment.style.right = '0';

    this.slider.appendChild(this.leftSegment.segment);
    this.slider.appendChild(this.rightSegment.segment);

    new ResizeObserver(() => this.updateVisual()).observe(this.slider);
    this.registerEventHandlers();
  }

  private createRoot(): HTMLDivElement {
    const root = document.createElement('div');
    root.id = this.id;
    root.style.height = this.heigth + 'px';
    root.style.width = `calc(100% - ${AccurateSlider.PADDING * 2}px)`;
    root.style.backgroundColor = 'transparent';
    root.style.display = 'flex';
    root.style.cursor = 'pointer';
    root.style.paddingLeft = `${AccurateSlider.PADDING}px`;
    root.style.paddingRight = `${AccurateSlider.PADDING}px`;
    return root;
  }

  private getValue(event: MouseEvent) {
    const x =
      event.pageX -
      this.slider.getBoundingClientRect().left -
      AccurateSlider.PADDING;
    const value =
      (x /
        (this.slider.getBoundingClientRect().width -
          AccurateSlider.PADDING * 2)) *
      (this.maxVal - this.minVal);
    return Math.min(value, this.maxVal);
  }

  private registerEventHandlers() {
    this.slider.addEventListener('mousedown', event => {
      this.mousedown = true;
      this.lastClickedValue = this.getValue(event);
      this.value = this.lastClickedValue;
    });

    this.slider.addEventListener('mousemove', event => {
      this.onHoverPositionChangesListeners.forEach(listener =>
        listener(Math.round(this.getValue(event)))
      );
      if (event.buttons === 1) {
        this.lastClickedValue = this.getValue(event);
        this.value = this.lastClickedValue;
      }
    });

    document.addEventListener('mouseup', _ => {
      if (this.mousedown) {
        this.notifyUpdateValue(this.lastClickedValue);
        this.value = this.lastClickedValue;
      }
      this.mousedown = false;
    });
  }

  private updateVisual() {
    this.leftSegment.width = this.valueToPixel(this.value);
    this.rightSegment.width = this.valueToPixel(this.maxVal - this.value);
  }

  private valueToPixel(value: number): number {
    return (
      (value / this.maxVal) *
      (this.slider.getBoundingClientRect().width - AccurateSlider.PADDING * 2)
    );
  }
}

class SliderSegment {
  public segment: HTMLDivElement;
  private _width = 0;

  get width(): number {
    return this._width;
  }

  set width(width: number) {
    this._width = width;
    this.segment.style.width = width + 'px';
  }

  get color(): string {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
    this.segment.style.backgroundColor = color;
  }

  constructor(private _color: string) {
    this.segment = this.createSegment();
  }

  private createSegment(): HTMLDivElement {
    const segment = document.createElement('div');
    segment.style.backgroundColor = this.color;
    segment.style.height = '100%';
    return segment;
  }
}
