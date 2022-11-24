import { Entity } from './Entity';
import { Event } from './Event';
import { EventFactory } from './EventFactory';
import { EventSerialized } from './EventSerialized';
import { SimplayGrid } from './SimplayGrid';
import { Sprite } from './Sprite';
import { Visual } from './Visual';

export interface SimulationDataSerialized {
  entities: Entity[];
  grid: SimplayGrid;
  sprites: Sprite[];
  visuals: Visual[];
  events: EventSerialized[];
}

export class SimulationData {
  events: Event[];
  grid: SimplayGrid;
  entities: Entity[];
  visuals: Visual[];
  sprites: Sprite[];

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
