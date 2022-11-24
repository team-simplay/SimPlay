import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { SimplayGrid } from "./SimplayGrid";

export function create(
  grid: SimplayGrid,
  container: HTMLElement
): PIXI.Application {
  const app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundColor: 0xd3d3d3,
    antialias: true,
    powerPreference: 'high-performance',
  });
  container.appendChild(app.view as HTMLCanvasElement);

  app.stage = new PIXILAYERS.Stage();
  const pixiContainer = new PIXI.Container();
  pixiContainer.name = 'pixiContainer';
  app.stage.addChild(pixiContainer);

  PIXI.settings.ROUND_PIXELS = true;
  PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;

  createTiles(
    grid,
    pixiContainer,
    container.clientWidth,
    container.clientHeight
  );

  return app;
}

function createTiles(
  grid: SimplayGrid,
  container: PIXI.Container,
  width: number,
  height: number
) {
  const areaContainer = new PIXI.Container();
  areaContainer.name = 'areaContainer';
  container.addChild(areaContainer);
  const tileWidth = width / grid.cols;
  const tileHeight = height / grid.rows;
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.cols; column++) {
      const rect = new PIXI.Container();
      rect.name = 'rect';

      const border = new PIXI.Graphics();
      border
        .beginFill(0x000000)
        .drawRect(0, 0, tileWidth, tileHeight)
        .endFill();
      border.x = column * tileWidth;
      border.y = row * tileHeight;
      rect.addChild(border);

      const tile = new PIXI.Graphics();
      tile
        .beginFill(0xffffff)
        .drawRect(0, 0, tileWidth - 2, tileHeight - 2)
        .endFill();
      tile.name = `area-${column}-${row}`;
      tile.x = column * tileWidth + 1;
      tile.y = row * tileHeight + 1;
      rect.addChild(tile);

      areaContainer.addChild(rect);
      const text = new PIXI.Text(`${column}-${row}`, {
        fontFamily: 'Arial',
        fontSize: 12,
        align: 'center',
      });
      text.x = column * tileWidth + tileWidth / 2;
      text.y = row * tileHeight + tileHeight / 2;
      text.alpha = 0.5;
      areaContainer.addChild(text);
    }
  }
}
