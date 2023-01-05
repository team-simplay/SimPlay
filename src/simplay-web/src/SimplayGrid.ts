import { SimplayArea } from './SimplayArea';

export interface SimplayGrid {
  readonly areas: SimplayArea[];
  readonly cols: number;
  readonly rows: number;
  readonly width: number; 
  readonly height: number;
}
