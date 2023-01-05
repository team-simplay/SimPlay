import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler, SimulationDataSerialized } from 'simplay-web';
import playIcon from '../style/icons/play_arrow.svg';
import pauseIcon from '../style/icons/pause.svg';
import skipIcon from '../style/icons/skip_next.svg';
import resetIcon from '../style/icons/restart.svg';
import tippy, { followCursor } from 'tippy.js';
import '../style/index.css';
import { StartPauseButton } from './startPauseButton';
import { Handler } from './utils';
import { SpeedSelector, SpeedSelectorValues } from './speedSelector';
import { AccurateSlider } from './accurateSlider';
import { StepInfo } from './stepInfo';

const SIMPLAY_CSS_COMMON_CLASS = 'jp-render-simplay';

/**
 * The MIME type for simplay.
 *
 */
export const SIMPLAY_MIME_TYPE = 'application/simplay+json';

/**
 * A widget for rendering SimPlay, for usage with rendermime.
 */
export class RenderSimplay extends Widget implements IRenderMime.IRenderer {
  private static TOOLTIP_THEME = 'light';

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    console.info('JupyterLab extension simplay_jupyter is activated!');
    this._mimeType = options.mimeType;
    this.addClass(SIMPLAY_CSS_COMMON_CLASS);
  }

  /**
   * Render SimPlay into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    this.reset();
    const data = model.data[
      this._mimeType
    ] as unknown as SimulationDataSerialized;

    // add 4 to align the left and right side of the grid and the slider
    const simplayContainer = this.createSimplayContainer(data.grid.width + 4);
    const simplayGridContainer = this.createSimplayGridContainer();
    const controlsContainer = this.createControlsContainer();

    const simulationSpooler = new SimulationSpooler(data, simplayGridContainer);

    this.createControls(controlsContainer, simulationSpooler);

    simplayContainer.appendChild(simplayGridContainer);
    simplayContainer.appendChild(controlsContainer);
    this.node.appendChild(simplayContainer);
    return Promise.resolve();
  }

  private createControls(
    controlsContainer: HTMLDivElement,
    simulationSpooler: SimulationSpooler
  ) {
    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('simplay-controls');
    const controlButtonsContainer = document.createElement('div');
    controlButtonsContainer.classList.add('simplay-controls');

    const controlHandler = new Handler();

    const startPauseButton = this.createStartPauseButton(
      'startPauseButton',
      simulationSpooler,
      controlHandler
    );
    const stepInfo = new StepInfo(
      'simplay-step-info',
      0,
      simulationSpooler.getTotalSteps()
    );
    const stepSlider = this.createStepSlider(
      simulationSpooler,
      stepInfo,
      controlHandler,
      startPauseButton
    );
    const resetButton = this.createResetButton(
      controlHandler,
      simulationSpooler,
      startPauseButton
    );
    const advanceOneStepButton = this.createAdvanceOneStepButton(
      controlHandler,
      simulationSpooler,
      startPauseButton
    );
    const speedSelectorButton = this.createSpeedSelector(simulationSpooler);

    simulationSpooler.addStepChangedEventListener(ts => {
      stepInfo.currentStep = ts;
      if (controlHandler.state === Handler.ENABLED) {
        stepSlider.value = ts;
      }
    });

    // Changing the order of the append calls affects the actual order in the UI.
    controlButtonsContainer.appendChild(startPauseButton.button);
    controlButtonsContainer.appendChild(resetButton);
    controlButtonsContainer.appendChild(advanceOneStepButton);
    controlButtonsContainer.appendChild(speedSelectorButton);
    controlButtonsContainer.appendChild(stepInfo.render());

    sliderContainer.appendChild(stepSlider.slider);

    controlsContainer.appendChild(sliderContainer);
    controlsContainer.appendChild(controlButtonsContainer);
  }

  private reset() {
    this.node.innerHTML = '';
  }

  private createControlsContainer() {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('simplay-controls-container');
    return controlsContainer;
  }

  private createSimplayGridContainer() {
    const simplayGridContainer = document.createElement('div');
    simplayGridContainer.id = 'simplay-grid-container';
    simplayGridContainer.classList.add('simplay-grid-container');
    return simplayGridContainer;
  }

  private createSimplayContainer(width: number) {
    const simplayContainer = document.createElement('div');
    simplayContainer.id = 'simplay-container';
    simplayContainer.classList.add('simplay-container');
    simplayContainer.style.width = width + 'px';
    return simplayContainer;
  }

  private createStepSlider(
    simulationSpooler: SimulationSpooler,
    stepInfo: StepInfo,
    controlHandler: Handler,
    startPauseButton: StartPauseButton
  ) {
    const stepSlider = new AccurateSlider(
      'simplay-slider',
      0,
      simulationSpooler.getTotalSteps(),
      0
    );

    const stepSliderPopup = tippy(stepSlider.slider, {
      placement: 'top',
      content: '00:00',
      allowHTML: true,
      delay: [300, 50],
      arrow: false,
      followCursor: 'horizontal',
      theme: RenderSimplay.TOOLTIP_THEME,
      plugins: [followCursor]
    });
    stepSlider.addOnHoverPositionChangedListener((value: number) => {
      stepSliderPopup.setContent(stepInfo.formatValueDelegate(value));
    });
    stepSlider.addOnValueChangedListener((value: number) => {
      controlHandler.disable();
      simulationSpooler
        .skipTo(value)
        .then(() => {
          startPauseButton.reset();
          controlHandler.enable();
        })
        .catch(() => {
          controlHandler.enable();
        });
    });
    return stepSlider;
  }

  private createStartPauseButton(
    id: string,
    simulationSpooler: SimulationSpooler,
    controlHandler: Handler
  ) {
    const startPauseButton = new StartPauseButton(
      playIcon,
      pauseIcon,
      () => {
        controlHandler.disable();
        simulationSpooler.pause().then(() => {
          controlHandler.enable();
        });
      },
      () => {
        simulationSpooler.run();
      }
    );
    startPauseButton.button.id = id;
    controlHandler.attachDisable(() => {
      startPauseButton.button.disabled = true;
    });
    controlHandler.attachEnable(() => {
      startPauseButton.button.disabled = false;
    });
    return startPauseButton;
  }

  private createSpeedSelector(simulationSpooler: SimulationSpooler) {
    const speedInput = new SpeedSelector((value: string) => {
      simulationSpooler.setSpeedFactor(SpeedSelectorValues[Number(value)]);
    });
    // container to have tippy popover in the same parent as the button supporting better accessibility
    const speedInputContainer = document.createElement('div');
    speedInputContainer.appendChild(speedInput.button);
    return speedInputContainer;
  }

  private createAdvanceOneStepButton(
    controlHandler: Handler,
    simulationSpooler: SimulationSpooler,
    startPauseButton: StartPauseButton
  ) {
    const advanceOneStepButtonIconSpan = this.createIconSpan(skipIcon);
    const advanceOneStepButton = this.createButton(
      advanceOneStepButtonIconSpan,
      ['simplay-button']
    );
    tippy(advanceOneStepButton, {
      placement: 'top',
      content: 'Forward 1 Step',
      delay: [300, 50],
      arrow: false,
      theme: RenderSimplay.TOOLTIP_THEME
    });
    controlHandler.attachDisable(() => {
      advanceOneStepButton.disabled = true;
    });
    controlHandler.attachEnable(() => {
      advanceOneStepButton.disabled = false;
    });
    advanceOneStepButton.addEventListener('click', () => {
      controlHandler.disable();
      startPauseButton.reset();
      simulationSpooler
        .advanceOneStep()
        .then(() => {
          controlHandler.enable();
        })
        .catch(() => {
          controlHandler.enable();
        });
    });
    return advanceOneStepButton;
  }

  private createResetButton(
    controlHandler: Handler,
    simulationSpooler: SimulationSpooler,
    startPauseButton: StartPauseButton
  ) {
    const resetIconSpan = this.createIconSpan(resetIcon);
    const resetButton = this.createButton(resetIconSpan, ['simplay-button']);
    tippy(resetButton, {
      placement: 'top',
      content: 'Reset',
      delay: [300, 50],
      arrow: false,
      theme: RenderSimplay.TOOLTIP_THEME
    });
    controlHandler.attachDisable(() => {
      resetButton.disabled = true;
    });
    controlHandler.attachEnable(() => {
      resetButton.disabled = false;
    });
    resetButton.addEventListener('click', () => {
      controlHandler.disable();
      startPauseButton.reset();
      simulationSpooler
        .reset()
        .then(() => {
          controlHandler.enable();
        })
        .catch(() => {
          controlHandler.enable();
        });
    });
    return resetButton;
  }

  private createIconSpan(svgIconString: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.classList.add('simplay-icon');
    span.innerHTML = svgIconString;
    return span;
  }

  private createButton(
    icon: HTMLSpanElement,
    classes: string[]
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.appendChild(icon);
    classes.forEach(className => button.classList.add(className));
    return button;
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for simplay data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [SIMPLAY_MIME_TYPE],
  createRenderer: options => new RenderSimplay(options)
};

const extension: IRenderMime.IExtension = {
  id: 'simplay-jupyter',
  rendererFactory,
  rank: 59,
  dataType: 'json',
  documentWidgetFactoryOptions: [
    {
      name: 'Simplay',
      primaryFileType: 'simplay',
      fileTypes: ['simplay', 'json'],
      defaultFor: ['simplay']
    }
  ],
  fileTypes: [
    {
      mimeTypes: [SIMPLAY_MIME_TYPE],
      name: 'simplay',
      extensions: ['.simplay', '.simplay.json'],
      iconClass: 'jp-simplayIcon',
      fileFormat: 'json'
    }
  ]
};

export default extension;
