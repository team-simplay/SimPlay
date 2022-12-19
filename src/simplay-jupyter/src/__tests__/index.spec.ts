import { RenderSimplay } from '../index';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler } from 'simplay-web';

const mockRun = jest.fn();
const mockPause = jest.fn();
const mockReset = jest.fn();
const mockAdvanceOneStep = jest.fn();
const mockSetSpeedFactor = jest.fn();
const mockSkipTo = jest.fn();

jest.mock('simplay-web', () => {
  return {
    SimulationSpooler: jest.fn().mockImplementation(() => {
      return {
        run: mockRun,
        pause: mockPause,
        reset: mockReset,
        advanceOneStep: mockAdvanceOneStep,
        setSpeedFactor: mockSetSpeedFactor,
        skipTo: mockSkipTo,
        addStepChangedEventListener: (callback: (step: number) => void) => {
          callback(1);
        }
      };
    })
  };
});

class CustomResizeObserver {
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

describe('RenderSimplay tests', () => {
  let renderSimplay: RenderSimplay;
  const model = {
    data: {
      'application/simplay+json': undefined
    } as IRenderMime.IMimeModel.ISetDataOptions
  } as IRenderMime.IMimeModel;

  beforeAll(() => {
    globalThis.ResizeObserver = CustomResizeObserver;
  });
  beforeEach(() => {
    const options = {
      mimeType: 'application/simplay+json'
    } as IRenderMime.IRendererOptions;
    renderSimplay = new RenderSimplay(options);
  });

  it('should create all controls', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;
      expect(SimulationSpooler).toHaveBeenCalled();
      // expect the three buttons play, reset and skip to be around
      expect(
        controlsContainer.getElementsByClassName('simplay-button').length
      ).toBe(3);
      // expect the three labels for Speed, skipTo and current step to be around
      expect(
        controlsContainer.getElementsByClassName('simplay-label').length
      ).toBe(3);
      // expect inputs for speed and skipTo to be around
      expect(controlsContainer.getElementsByTagName('input').length).toBe(2);
    });
  });

  it('should handle play and pause', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const startPauseButton = controlsContainer
        .getElementsByClassName('simplay-button')
        .item(0) as HTMLButtonElement;

      startPauseButton.click();
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockPause).toHaveBeenCalledTimes(0);
      startPauseButton.click();
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockPause).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle reset', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const resetButton = controlsContainer
        .getElementsByClassName('simplay-button')
        .item(1) as HTMLButtonElement;

      resetButton.click();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle advanceOneStepButton', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const advanceOneStepButton = controlsContainer
        .getElementsByClassName('simplay-button')
        .item(2) as HTMLButtonElement;

      advanceOneStepButton.click();
      expect(mockAdvanceOneStep).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle skipTo', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const skipToInput = controlsContainer
        .getElementsByTagName('input')
        .item(1) as HTMLInputElement;

      var event = new Event('keyup');
      skipToInput.dispatchEvent(event);
      expect(mockSkipTo).toHaveBeenCalled();
    });
  });

  it('should handle speedInput', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const skipToInput = controlsContainer
        .getElementsByTagName('input')
        .item(0) as HTMLInputElement;

      var event = new Event('change');
      skipToInput.dispatchEvent(event);
      expect(mockSetSpeedFactor).toHaveBeenCalled();
    });
  });

  it('should handle step change', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const currentStepLabel = controlsContainer
        .getElementsByClassName('simplay-label')
        .item(2) as HTMLParagraphElement;

      expect(currentStepLabel.innerText).toContain('1');
    });
  });
});
