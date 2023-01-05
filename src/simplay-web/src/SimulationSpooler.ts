import { createGrid } from './Grid';
import { createContext, SimplayContext } from './SimplayContext';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { createEntities, resetDisplayEntity } from './Entity';

/**
 * Spools and displays a simulation in the given container
 */
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
    const app = this.createApp();
    this.context = createContext(app, this.simulationData);
    createGrid(this.context);
    createEntities(this.context);
  }

  /**
   * Add listener that gets called once the currentSimTimeStamp changes
   * @param listener 
   */
  addStepChangedEventListener(listener: (timestamp: number) => void) {
    this.stepChangedEventListeners.push(listener);
  }

  /**
   * Remove currentSimTimeStamp change listener 
   */
  removeStepChangedEventListener(listener: (timestamp: number) => void) {
    this.stepChangedEventListeners = this.stepChangedEventListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyStepChanged() {
    this.stepChangedEventListeners.forEach((listener) =>
      listener(this.currentSimTimeStamp)
    );
  }

  private setSimulationStep(step: number) {
    this.currentSimTimeStamp = Math.round(step);
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

  /**
   * @returns step total number of steps
   */
  getTotalSteps(): number {
    return Math.max(
      ...this.simulationData.events.map((event) => event.timestamp)
    );
  }

  /**
   * Starts spooling the events
   */
  async run() {
    const maxTimestamp = this.getTotalSteps();
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

  /**
   * Pauses the spooler
   */
  async pause() {
    this.stopRequested = true;
    // Wait for the current step to finish
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / this.speedFactor)
    );
    this.stopRequested = false;
  }

  /**
   * Pauses the spooler and makes one step forward
   */
  async advanceOneStep() {
    await this.pause();
    this.spoolTimestamp(this.currentSimTimeStamp);
    this.setSimulationStep(this.currentSimTimeStamp + 1);
  }

  /**
   * Pauses the spooler and skips to the given timestamp
   * @param timestamp to skip to
   */
  async skipTo(timestamp: number) {
    timestamp = Math.round(timestamp);
    await this.pause();
    if (timestamp < this.currentSimTimeStamp) {
      await this.reset();
    }
    for (let i = this.currentSimTimeStamp; i <= timestamp; i++) {
      this.spoolTimestamp(i);
    }
    this.setSimulationStep(timestamp);
  }

  /**
   * Pauses the spooler and resets it to the initial state
   */
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

  /**
   * Set the speedFactor of the spooler to the given value
   * @param value speedFactor
   * @returns speedFactor 
   */
  setSpeedFactor(value: number): number {
    if (value <= 0) {
      throw new Error('Speed factor must be greater than 0');
    }
    this.speedFactor = value;
    return this.speedFactor;
  }

  private createApp() {
    const app = new PIXI.Application({
      width: this.simulationData.grid.width,
      height: this.simulationData.grid.height,
      backgroundColor: 0xd3d3d3,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.DOMContainer.appendChild(app.view as HTMLCanvasElement);

    app.stage = new PIXILAYERS.Stage();

    PIXI.settings.ROUND_PIXELS = true;
    PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;
    return app;
  }
}
