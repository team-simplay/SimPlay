import { Entity } from './Entity';
import { Event } from './Event';
import { EventFactory } from './EventFactory';
import { SimplayGrid } from './SimplayGrid';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { Sprite } from './Sprite';
import { Visual } from './Visual';

export class SimulationData {
  readonly events: Event[];
  readonly grid: SimplayGrid;
  readonly entities: Entity[];
  readonly visuals: Visual[];
  readonly sprites: Sprite[];

  constructor(
    events: Event[],
    grid: SimplayGrid,
    entities: Entity[],
    visuals: Visual[],
    sprites: Sprite[]
  ) {
    this.events = events;
    this.grid = grid;
    this.entities = entities;
    this.visuals = visuals;
    this.sprites = sprites;
  }

  public static fromSerialized(
    serialized: SimulationDataSerialized
  ): SimulationData {
    const events = serialized.events.map((event) => {
      return EventFactory.fromSerialized(event);
    });
    return new SimulationData(
      events,
      serialized.grid,
      serialized.entities,
      serialized.visuals,
      serialized.sprites
    );
  }
}
