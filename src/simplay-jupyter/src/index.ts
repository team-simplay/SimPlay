import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the simplay_jupyter extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'simplay_jupyter:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension simplay_jupyter is activated!');
  }
};

export default plugin;
