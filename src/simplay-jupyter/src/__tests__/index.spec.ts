import { RenderSimplay } from '../index';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler } from 'simplay-web';
import { makeCustomResizeObseverGloballyAvailable } from './CustomResizeObserver';

const mockRun = jest.fn();
const mockPause = jest.fn().mockResolvedValue(true);
const mockReset = jest.fn();
const mockAdvanceOneStep = jest.fn();
const mockSetSpeedFactor = jest.fn();
const mockSkipTo = jest.fn();
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
      'application/simplay+json': undefined
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
      // expect the three buttons play, reset and skip to be around
      expect(
        controlsContainer.getElementsByClassName('simplay-button').length
      ).toBe(4);
      // expect the label for current step and total steps to be around
      expect(
        controlsContainer.getElementsByClassName('simplay-label').length
      ).toBe(1);
      // expect slider to be around
      expect(
        sliderContainer.getElementsByClassName('simplay-accurate-slider').length
      ).toBe(1);
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

  // TODO this fails as the skipTo slider is not present from the beginning
  /* it('should handle skipTo', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(0) as HTMLDivElement;

      const skipToInput = controlsContainer
        .getElementsByTagName('simplay-accurate-slider')
        .item(0) as HTMLInputElement;

      var event = new Event('change');
      skipToInput.dispatchEvent(event);
      expect(mockSkipTo).toHaveBeenCalled();
    });
  }); */

  // TODO found no way yet to trigger the hover effect and find the tippy js popover
  /* it('should handle speedInput', () => {
    return renderSimplay.renderModel(model).then(() => {
      const parent = renderSimplay.node;
      const controlsContainer = parent
        .getElementsByClassName('simplay-controls')
        .item(1) as HTMLDivElement;

      const speedChangeButton = controlsContainer
        .getElementsByClassName('simplay-button')
        .item(3) as HTMLInputElement;
      const mouseEnterEvent = new Event('mouseover');
      speedChangeButton.dispatchEvent(mouseEnterEvent);

      const speedChangeSlider = parent
        .getElementsByClassName('simplay-speed-input')
        .item(0) as HTMLInputElement;

      const changeEvent = new Event('change');
      speedChangeSlider.dispatchEvent(changeEvent);
      expect(mockSetSpeedFactor).toHaveBeenCalled();
    });
  }); */
});
