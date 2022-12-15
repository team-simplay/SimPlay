import * as PIXI from 'pixi.js';
import { SimplayContext } from './SimplayContext';
import { SimplayArea } from './SimplayArea';

function validateArea(cols: number, rows: number, area: SimplayArea) {
  if (area.gridDefinition.x + area.gridDefinition.width > cols) {
    throw new Error(`Area ${area.id} is out of bounds: x + width > cols`);
  }
  if (area.gridDefinition.y + area.gridDefinition.height > rows) {
    throw new Error(`Area ${area.id} is out of bounds: y + height > rows`);
  }
}

export function createDebugGrid(context: SimplayContext) {
  const debugGrid = new PIXI.Graphics();
  debugGrid.name = 'debug-grid';
  for (let i = 0; i < context.simulationData.grid.cols; i++) {
    for (let j = 0; j < context.simulationData.grid.rows; j++) {
      debugGrid.lineStyle(1, 0x000000);
      debugGrid.drawRect(
        i * context.tileWidth,
        j * context.tileHeight,
        context.tileWidth,
        context.tileHeight
      );
      const text = new PIXI.Text(`${i},${j}`, {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0x000000,
        align: 'center',
      });
      text.x = i * context.tileWidth + context.tileWidth / 2;
      text.y = j * context.tileHeight + context.tileHeight / 2;
      text.anchor.set(0.5);
      debugGrid.addChild(text);
    }
  }
  context.areaContainer.addChild(debugGrid);
}

export function createGrid(context: SimplayContext) {
  for (const area of context.simulationData.grid.areas) {
    validateArea(
      context.simulationData.grid.cols,
      context.simulationData.grid.rows,
      area
    );
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
