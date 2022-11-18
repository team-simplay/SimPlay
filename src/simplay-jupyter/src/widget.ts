// Copyright (c) team-simplay
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

import { SimulationSpooler } from 'simplay-web';

export class SimPlayHostModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SimPlayHostModel.model_name,
      _model_module: SimPlayHostModel.model_module,
      _model_module_version: SimPlayHostModel.model_module_version,
      _view_name: SimPlayHostModel.view_name,
      _view_module: SimPlayHostModel.view_module,
      _view_module_version: SimPlayHostModel.view_module_version,
      simulationdata: '{}',
      height: '500px',
      width: '500px',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'SimPlayHostModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SimPlayHostView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SimPlayHostView extends DOMWidgetView {
  simspooler: SimulationSpooler;
  render() {
    this.el.classList.add('custom-widget');
    this.model.on('change:simulationdata', this.simulationdata_changed, this);
    this.model.on('change:height', this.height_changed, this);
    this.model.on('change:width', this.width_changed, this);
    this.simulationdata_changed();
    this.height_changed();
    this.width_changed();
  }

  simulationdata_changed() {
    const container = document.createElement('div');
    container.id = 'simplay-container';
    this.el.appendChild(container);
    // this would be the implementation to use simplay-web, but it does not work right now
    // leaving it here for future reference
    // this.simspooler = new SimulationSpooler(
    //   this.model.get('simulationdata'),
    //   container
    // );
    const span = document.createElement('span');
    span.innerHTML = this.model.get('simulationdata');
    this.el.appendChild(span);
  }

  height_changed() {
    this.el.style.height = this.model.get('height');
  }

  width_changed() {
    this.el.style.width = this.model.get('width');
  }
}
