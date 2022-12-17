import { JSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler, SimulationDataSerialized } from 'simplay-web';
import playIcon from '../style/icons/play_arrow.svg';
import pauseIcon from '../style/icons/pause.svg';
import skipIcon from '../style/icons/skip_next.svg';
import resetIcon from '../style/icons/restart.svg';
import tippy from 'tippy.js';
import '../style/index.css';
import { StartPauseButton } from './startPauseButton';

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

    const controls = document.createElement('div');
    controls.classList.add('simplay-controls');

    const observer = new ResizeObserver(() => {
      simulationSpooler = new SimulationSpooler(
        data as unknown as SimulationDataSerialized,
        simplayGridContainer
      );
      const currentStepInfo = document.createElement('p');
      currentStepInfo.id = 'currentStepInfo';
      currentStepInfo.classList.add('simplay-label');
      simulationSpooler.addStepChangedEventListener(ts => {
        currentStepInfo.innerText = 'Current Step: ' + ts;
      });
      const startPauseButton = this.createStartPauseButton(
        'startPauseButton',
        simulationSpooler
      );

      const resetButton = this.createResetButton();
      resetButton.addEventListener('click', () => {
        startPauseButton.reset();
        simulationSpooler.reset();
      });

      const advanceOneStepButton = this.createAdvanceOneStepButton();
      advanceOneStepButton.addEventListener('click', () => {
        simulationSpooler.advanceOneStep();
      });

      const spacer = this.createSpacer();

      const speedInputName = 'skipTo';
      const speedInputLabel = this.createLabel(
        'speedInputLabelId',
        speedInputName,
        'Speed: '
      );
      const speedInput = this.createSpeedInput(speedInputName);
      speedInput.addEventListener('change', (event: Event) => {
        if (event.currentTarget) {
          simulationSpooler.setSpeedFactor(
            Number((event.currentTarget as HTMLInputElement).value)
          );
        }
      });

      const skipToInputName = 'skipTo';
      const skipToLabel = this.createLabel(
        'skipToLabelId',
        skipToInputName,
        'Skip to: '
      );
      const skipToInput = this.createSkipToInput(skipToInputName);
      skipToInput.addEventListener('keyup', (event: Event) => {
        if (event.currentTarget) {
          simulationSpooler.skipTo(
            Number((event.currentTarget as HTMLInputElement).value)
          );
        }
      });

      const spacer2 = this.createSpacer();

      // Changing the order of the append calls affects the actual order in the UI.
      controls.appendChild(startPauseButton.button);
      controls.appendChild(resetButton);
      controls.appendChild(advanceOneStepButton);
      controls.appendChild(spacer);
      controls.appendChild(speedInputLabel);
      controls.appendChild(speedInput);
      controls.appendChild(skipToLabel);
      controls.appendChild(skipToInput);
      controls.appendChild(currentStepInfo);
      controls.appendChild(spacer2);
    });

    observer.observe(simplayContainer);

    simplayContainer.appendChild(controls);
    return Promise.resolve();
  }

  private createSkipToInput(name: string) {
    const skipToInput = document.createElement('input');
    skipToInput.type = 'number';
    skipToInput.name = name;
    skipToInput.classList.add('simplay-number-input');
    return skipToInput;
  }

  private createSpeedInput(name: string) {
    const speedInput = document.createElement('input');
    speedInput.type = 'range';
    speedInput.min = '0.2';
    speedInput.max = '20';
    speedInput.step = '0.2';
    speedInput.value = '1';
    speedInput.placeholder = 'Speedfactor';
    speedInput.name = name;
    return speedInput;
  }

  private createLabel(id: string, htmlFor: string, text: string) {
    const label = document.createElement('label');
    label.id = id;
    label.htmlFor = htmlFor;
    label.innerText = text;
    label.classList.add('simplay-label');
    return label;
  }

  private createSpacer() {
    const spacer = document.createElement('div');
    spacer.classList.add('simplay-spacer');
    return spacer;
  }

  private createStartPauseButton(
    id: string,
    simulationSpooler: SimulationSpooler
  ) {
    const startPauseButton = new StartPauseButton(
      playIcon,
      pauseIcon,
      () => {
        simulationSpooler.pause();
      },
      () => {
        simulationSpooler.run();
      }
    );
    startPauseButton.button.id = id;
    return startPauseButton;
  }

  private createAdvanceOneStepButton() {
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
    return advanceOneStepButton;
  }

  private createResetButton() {
    const resetIconSpan = this.createIconSpan(resetIcon);
    const resetButton = this.createButton(resetIconSpan, ['simplay-button']);
    tippy(resetButton, {
      placement: 'top',
      content: 'Reset',
      delay: [300, 50],
      arrow: false,
      theme: RenderSimplay.TOOLTIP_THEME
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
