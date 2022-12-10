import { JSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { SimulationSpooler } from 'simplay-web';

import '../style/index.css';
import { SimulationDataSerialized } from 'simplay-web/dist/SimulationDataSerialized';

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
    const data = model.data[this._mimeType] as JSONObject;

    const container = document.createElement('div');
    container.classList.add('simplay-container');

    this.node.innerHTML = ''; // clear the output
    this.node.appendChild(container);

    const simulationSpooler = new SimulationSpooler(
      data as unknown as SimulationDataSerialized,
      container
    );

    const controls = document.createElement('div');
    controls.classList.add('simplay-controls');

    const startButton = document.createElement('button');
    controls.appendChild(startButton);
    startButton.classList.add('start-button');
    startButton.innerText = 'Start';
    startButton.addEventListener('click', () => {
      const text = document.createElement('p');
      text.innerText = 'Simulationspooler started';
      controls.appendChild(text);
      simulationSpooler.run();
    });

    this.node.appendChild(controls);
    return Promise.resolve();
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
