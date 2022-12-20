import { createGrid } from './Grid';
import { createContext, SimplayContext } from './SimplayContext';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { createEntities, resetDisplayEntity } from './Entity';

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;
  public readonly context: SimplayContext;
  private speedFactor = 1;
  private stopRequested = false;
  private currentSimTimeStamp = 0;
  private stepChangedEventListeners: ((timestamp: number) => void)[] = [];

  constructor(
    simulationData: SimulationDataSerialized,
    container: HTMLElement
  ) {
    this.simulationData = simulationDataFactory(simulationData);
    this.DOMContainer = container;
    const app = createApp(this.DOMContainer);
    this.context = createContext(app, this.simulationData);
    createGrid(this.context);
    createEntities(this.context);
  }

  addStepChangedEventListener(listener: (timestamp: number) => void) {
    this.stepChangedEventListeners.push(listener);
  }

  removeStepChangedEventListener(listener: (timestamp: number) => void) {
    this.stepChangedEventListeners = this.stepChangedEventListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyStepChanged() {
    this.stepChangedEventListeners.forEach((listener) => listener(this.currentSimTimeStamp));
  }

  private setSimulationStep(step: number) {
    this.currentSimTimeStamp = step;
    this.notifyStepChanged();
  }

  private spoolTimestamp(timestamp: number) {
    const events = this.simulationData.events.filter(
      (event) => Math.round(event.timestamp) === timestamp
    );
    events.forEach((event) => {
      event.execute(this.context);
    });
  }

  async run() {
    const maxTimestamp = Math.max(
      ...this.simulationData.events.map((event) => event.timestamp)
    );
    while (!this.stopRequested) {
      const frameDuration = 1000 / this.speedFactor;
      const now = Date.now();

      this.spoolTimestamp(this.currentSimTimeStamp);

      const executionDuration = now - Date.now();
      if (this.currentSimTimeStamp > maxTimestamp) {
        this.stopRequested = true;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, frameDuration - executionDuration)
      );
      this.setSimulationStep(this.currentSimTimeStamp + 1);
    }
    this.stopRequested = false;
  }

  async pause() {
    this.stopRequested = true;
    // Wait for the current step to finish
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / this.speedFactor)
    );
    this.stopRequested = false;
  }

  async advanceOneStep() {
    await this.pause();
    this.spoolTimestamp(this.currentSimTimeStamp);
    this.setSimulationStep(this.currentSimTimeStamp + 1);
  }

  async skipTo(timestamp: number) {
    await this.pause();
    if (timestamp < this.currentSimTimeStamp) {
      this.reset();
    }
    for (let i = this.currentSimTimeStamp; i <= timestamp; i++) {
      this.spoolTimestamp(i);
    }
    this.setSimulationStep(timestamp);
  }

  async reset() {
    await this.pause();
    this.stopRequested = false;
    for (const entity of this.context.entityDictionary.values()) {
      const entityId = entity.container.name;
      const originalTint =
        this.simulationData.entities.find((entity) => entity.id === entityId)
          ?.tint ?? 0xffffff;
      resetDisplayEntity(entity, originalTint);
    }
    this.setSimulationStep(0);
  }

  setSpeedFactor(value: number): number {
    if (value <= 0) {
      throw new Error('Speed factor must be greater than 0');
    }
    this.speedFactor = value;
    return this.speedFactor;
  }
}

function createApp(container: HTMLElement) {
  const app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundColor: 0xd3d3d3,
    antialias: true,
    powerPreference: 'high-performance',
  });
  container.appendChild(app.view as HTMLCanvasElement);

  app.stage = new PIXILAYERS.Stage();

  PIXI.settings.ROUND_PIXELS = true;
  PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;
  return app;
}
