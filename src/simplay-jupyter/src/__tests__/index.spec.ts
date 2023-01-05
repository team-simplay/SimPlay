import { RenderSimplay } from '../index';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler } from 'simplay-web';
import { makeCustomResizeObseverGloballyAvailable } from './CustomResizeObserver';

const mockRun = jest.fn();
const mockPause = jest.fn().mockResolvedValue(true);
const mockReset = jest.fn().mockResolvedValue(true);
const mockAdvanceOneStep = jest.fn().mockResolvedValue(true);
const mockSetSpeedFactor = jest.fn();
const mockSkipTo = jest.fn().mockResolvedValue(true);
const mockGetTotalSteps = () => 100;

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
        getTotalSteps: mockGetTotalSteps,
        addStepChangedEventListener: (callback: (step: number) => void) => {
          callback(1);
        }
      };
    })
  };
});

describe('RenderSimplay tests', () => {
  let renderSimplay: RenderSimplay;
  const model = {
    data: {
      'application/simplay+json': { grid: { width: 0 } }
    } as IRenderMime.IMimeModel.ISetDataOptions
  } as IRenderMime.IMimeModel;

  beforeAll(() => {
    makeCustomResizeObseverGloballyAvailable();
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
      const sliderContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(1) as HTMLDivElement;
      expect(SimulationSpooler).toHaveBeenCalled();
      // expect the buttons play, reset, speed and skip to be around
      expect(
        controlsContainer.getElementsByClassName('simplay-button').length
      ).toBe(4);
      expect(
        controlsContainer.querySelector('#simplay-step-info')
      ).toBeDefined();
      expect(sliderContainer.querySelector('#simplay-slider')).toBeDefined();
    });
  });

  it('should handle play and pause', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(1) as HTMLDivElement;

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
        .item(1) as HTMLDivElement;

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
        .item(1) as HTMLDivElement;

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

      const skipToInput = controlsContainer.querySelector(
        '#simplay-slider'
      ) as HTMLDivElement;

      const mouseDown = new MouseEvent('mousedown', {});
      Object.assign(mouseDown, {
        pageX: 60
      });
      skipToInput.dispatchEvent(mouseDown);
      const mouseup = new Event('mouseup', {});
      document.dispatchEvent(mouseup);

      expect(mockSkipTo).toHaveBeenCalled();
    });
  });

  it('should handle speedInput', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(1) as HTMLDivElement;

      const speedChangeButton = controlsContainer
        .getElementsByClassName('simplay-button')
        .item(3) as HTMLInputElement;
      const mouseEnterEvent = new Event('focus');
      speedChangeButton.dispatchEvent(mouseEnterEvent);

      const speedChangeSlider = parent
        .getElementsByClassName('simplay-speed-input')
        .item(0) as HTMLInputElement;

      const changeEvent = new Event('change');
      speedChangeSlider.dispatchEvent(changeEvent);
      expect(mockSetSpeedFactor).toHaveBeenCalled();
    });
  });
});
