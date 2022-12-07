import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';

describe('context tests', () => {
  const simulationData = {
    grid: {
      areas: [
        {
          id: 'area51',
          name: 'ALIEN AREA',
          color: 0x1234af,
          gridDefinition: {
            width: 2,
            height: 2,
            x: 1,
            y: 1,
          },
        },
      ],
      cols: 5,
      rows: 5,
    },
    entities: [],
    visuals: [],
    events: [],
    sprites: [],
  } as SimulationData;

  it('should calculate the correct tile size', () => {
    const containerWidth = 500;
    const containerHeight = 500;

    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    expect(context.tileWidth).to.equal(
      containerWidth / simulationData.grid.cols
    );
    expect(context.tileHeight).to.equal(
      containerHeight / simulationData.grid.rows
    );
  });

  it('should create an areaContainer', () => {
    const containerWidth = 500;
    const containerHeight = 500;

    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    expect(context.areaContainer).to.not.be.undefined;
    expect(app.stage.children).to.contain(context.areaContainer);
  });

  it('should create an entityContainer', () => {
    const containerWidth = 500;
    const containerHeight = 500;

    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    expect(context.entityContainer).to.not.be.undefined;
    expect(app.stage.children).to.contain(context.entityContainer);
  });

  it('should create an interactionContainer', () => {
    const containerWidth = 500;
    const containerHeight = 500;

    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    expect(context.interactionContainer).to.not.be.undefined;
    expect(app.stage.children).to.contain(context.interactionContainer);
  });
});
