import { Area } from './Area';

export interface SimplayGrid {
  readonly areas: Area[];
  readonly cols: number;
  readonly rows: number;
}
