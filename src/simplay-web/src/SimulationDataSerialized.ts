import { Entity } from './Entity';
import { EventSerialized } from './event/EventSerialized';
import { SimplayGrid } from './SimplayGrid';
import { Visual } from './Visual';

export interface SimulationDataSerialized {
  entities: Entity[];
  grid: SimplayGrid;
  visuals: Visual[];
  events: EventSerialized[];
}
