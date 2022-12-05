import { Entity } from './Entity';
import { Event } from './event/Event';
import { eventFactory } from './event/EventFactory';
import { SimplayGrid } from './SimplayGrid';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { Visual } from './Visual';

export class SimulationData {
  readonly events: Event[];
  readonly grid: SimplayGrid;
  readonly entities: Entity[];
  readonly visuals: Visual[];

  constructor(
    events: Event[],
    grid: SimplayGrid,
    entities: Entity[],
    visuals: Visual[]
  ) {
    this.events = events;
    this.grid = grid;
    this.entities = entities;
    this.visuals = visuals;
  }
}

export function simulationDataFactory(
  serialized: SimulationDataSerialized
): SimulationData {
  const events = serialized.events.map((event) => {
    return eventFactory(event);
  });
  return new SimulationData(
    events,
    serialized.grid,
    serialized.entities,
    serialized.visuals
  );
}
