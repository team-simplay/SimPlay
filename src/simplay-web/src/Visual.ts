import { Assets } from 'pixi.js';

export interface Visual {
  id: string;
  frames: string[];
}

export async function preloadImages(visuals: Visual[]): Promise<void> {
  const allFrames = visuals.flatMap((visual) => visual.frames);
  const uniqueFrames = [...new Set(allFrames)];
  for (const frame of uniqueFrames) {
    await Assets.load(frame);
  }
}
