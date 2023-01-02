import { JSONObject } from '@lumino/coreutils';
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
import { ControlHandler, tsToTime } from './utils';
import { SpeedSelector } from './speedSelector';
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
    let simulationSpooler: SimulationSpooler;
    const data = model.data[this._mimeType] as JSONObject;

    const simplayContainer = document.createElement('div');
    simplayContainer.id = 'simplayContainer';
    simplayContainer.classList.add('simplay-container');

    const simplayGridContainer = document.createElement('div');
    simplayGridContainer.id = 'simplayGridContainer';
    simplayGridContainer.classList.add('simplay-grid-container');
    simplayContainer.appendChild(simplayGridContainer);

    this.node.innerHTML = '';
    this.node.appendChild(simplayContainer);

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('simplay-controls-container');

    const controlsStepInfo = document.createElement('div');
    controlsStepInfo.classList.add('simplay-controls');

    const controls = document.createElement('div');
    controls.classList.add('simplay-controls');

    const observer = new ResizeObserver(() => {
      const controlHandler = new ControlHandler();

      simulationSpooler = new SimulationSpooler(
        data as unknown as SimulationDataSerialized,
        simplayGridContainer
      );

      const stepSlider = new AccurateSlider(
        'sli',
        0,
        simulationSpooler.getTotalSteps(),
        0
      );

      stepSlider.addOnValueChangedListener((value: number) => {
        controlHandler.disable();
        simulationSpooler.skipTo(value).then(() => {
          startPauseButton.reset();
          controlHandler.enable();
        });
      });

      let stepSliderPopupMode = StepInfo.STEP_MODE;
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
        if (stepSliderPopupMode === StepInfo.TIME_MODE) {
          stepSliderPopup.setContent(tsToTime(value));
        } else {
          stepSliderPopup.setContent(value.toString());
        }
      });

      const stepInfo = new StepInfo(0, simulationSpooler.getTotalSteps());
      stepInfo.addModeListener((mode: string) => {
        stepSliderPopupMode = mode;
      });
      simulationSpooler.addStepChangedEventListener(ts => {
        stepInfo.setCurrentStep(ts);
        if (controlHandler.state === 'enabled') {
          stepSlider.value = ts;
        }
      });

      controlsStepInfo.appendChild(stepSlider.slider);

      const startPauseButton = this.createStartPauseButton(
        'startPauseButton',
        simulationSpooler,
        controlHandler
      );

      const resetButton = this.createResetButton(controlHandler);
      resetButton.addEventListener('click', () => {
        startPauseButton.reset();
        simulationSpooler.reset();
      });

      const advanceOneStepButton =
        this.createAdvanceOneStepButton(controlHandler);
      advanceOneStepButton.addEventListener('click', () => {
        simulationSpooler.advanceOneStep();
        startPauseButton.reset();
      });

      const speedInput = new SpeedSelector((value: string) => {
        const values = [0.5, 1, 2, 4, 10, 20, 50, 100];

        simulationSpooler.setSpeedFactor(values[Number(value)]);
      });

      // Changing the order of the append calls affects the actual order in the UI.
      controls.appendChild(startPauseButton.button);
      controls.appendChild(resetButton);
      controls.appendChild(advanceOneStepButton);
      controls.appendChild(speedInput.button);
      controls.appendChild(stepInfo.render());

      controlsContainer.appendChild(controlsStepInfo);
      controlsContainer.appendChild(controls);
    });

    observer.observe(simplayContainer);

    simplayContainer.appendChild(controlsContainer);
    return Promise.resolve();
  }

  private createStartPauseButton(
    id: string,
    simulationSpooler: SimulationSpooler,
    controlHandler: ControlHandler
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

  private createAdvanceOneStepButton(controlHandler: ControlHandler) {
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
    return advanceOneStepButton;
  }

  private createResetButton(controlHandler: ControlHandler) {
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
