import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { SimplayGrid } from './SimplayGrid';
import { SimplayContext } from './SimplayContext';
import { SimplayArea } from './SimplayArea';

export function create(
  grid: SimplayGrid,
  container: HTMLElement
): SimplayContext {
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

  const context = createContext(app, grid);
  setupAreas(grid, context);

  return context;
}

function createContext(
  app: PIXI.Application,
  grid: SimplayGrid
): SimplayContext {
  const context: SimplayContext = {
    tileHeight: app.screen.height / grid.rows,
    tileWidth: app.screen.width / grid.cols,
    app: app,
    areaContainer: new PIXI.Container(),
    entityContainer: new PIXI.Container(),
    interactionContainer: new PIXI.Container(),
  };
  context.areaContainer.name = 'areaContainer';
  context.entityContainer.name = 'entityContainer';
  context.interactionContainer.name = 'interactionContainer';
  app.stage.addChild(context.areaContainer);
  app.stage.addChild(context.entityContainer);
  app.stage.addChild(context.interactionContainer);
  return context;
}

function validateArea(cols: number, rows: number, area: SimplayArea) {
  if (area.gridDefinition.x + area.gridDefinition.width > cols) {
    throw new Error(`Area ${area.id} is out of bounds: x + width > cols`);
  }
  if (area.gridDefinition.y + area.gridDefinition.height > rows) {
    throw new Error(`Area ${area.id} is out of bounds: y + height > rows`);
  }
}

function setupAreas(grid: SimplayGrid, context: SimplayContext) {
  for (const area of grid.areas) {
    validateArea(grid.cols, grid.rows, area);
    const areaGraphics = new PIXI.Graphics();
    areaGraphics
      .beginFill(area.color)
      .drawRect(
        0,
        0,
        area.gridDefinition.width * context.tileWidth,
        area.gridDefinition.height * context.tileHeight
      )
      .lineStyle(1, 0x000000)
      .endFill();
    areaGraphics.x = area.gridDefinition.x * context.tileWidth;
    areaGraphics.y = area.gridDefinition.y * context.tileHeight;
    areaGraphics.name = `area-${area.id}`;
    context.areaContainer.addChild(areaGraphics);
    const areaText = new PIXI.Text(area.name, {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0x000000,
      align: 'center',
    });
    areaText.name = `area-${area.id}-text`;
    areaText.alpha = 0.3;
    areaText.x =
      area.gridDefinition.x * context.tileWidth +
      (area.gridDefinition.width * context.tileWidth) / 2;
    areaText.y =
      area.gridDefinition.y * context.tileHeight +
      (area.gridDefinition.height * context.tileHeight) / 2;
    areaText.anchor.set(0.5, 0.5);
    context.areaContainer.addChild(areaText);
  }
}
