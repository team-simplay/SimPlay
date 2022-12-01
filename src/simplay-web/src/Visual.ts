import { Assets } from 'pixi.js';

export interface Visual {
  id: string;
  frames: string[];
}

export async function preLoadImages(visuals: Visual[]) {
  for (const visual of visuals) {
    for (const frame of visual.frames) {
      Assets.backgroundLoad(frame);
    }
  }
}
