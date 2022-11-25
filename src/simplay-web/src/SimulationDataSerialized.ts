import { Entity } from './Entity';
import { EventSerialized } from './event/EventSerialized';
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
