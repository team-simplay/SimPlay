import { createGrid } from '../src/Grid';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';
import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';

describe('Grid tests', function () {
  const grid = {
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
    width: 900,
    height: 1000,
  };

  const simulationData = {
    grid: grid,
    entities: [],
    visuals: [],
    events: [],
  } as SimulationData;

  describe('area tests', () => {
    it('should create an area', () => {
      const containerWidth = 500;
      const containerHeight = 500;
      const app = new PIXI.Application({
        width: containerWidth,
        height: containerHeight,
      });
      app.stage = new PIXILAYERS.Stage();

      const context = createContext(app, simulationData);
      createGrid(context);
      const area51 = context.areaContainer.getChildByName('area-area51');
      expect(area51).to.be.an.instanceof(PIXI.Graphics);
      expect(area51.x).to.equal(100);
      expect(area51.y).to.equal(100);
    });

    it('should create an area label', () => {
      const containerWidth = 500;
      const containerHeight = 500;
      const app = new PIXI.Application({
        width: containerWidth,
        height: containerHeight,
      });
      app.stage = new PIXILAYERS.Stage();

      const context = createContext(app, simulationData);
      createGrid(context);
      const area51Text = context.areaContainer.getChildByName(
        'area-area51-text'
      ) as PIXI.Text;
      expect(area51Text).to.be.an.instanceof(PIXI.Text);
      expect(area51Text.text).to.equal('ALIEN AREA');
    });

    it('should reject an area which is out of bounds at dimension x', () => {
      const grid = {
        areas: [
          {
            id: 'area51',
            name: 'ALIEN AREA',
            color: 0x1234af,
            gridDefinition: {
              width: 6,
              height: 2,
              x: 1,
              y: 1,
            },
          },
        ],
        cols: 5,
        rows: 5,
        width: 900,
        height: 1000,
      };

      const containerWidth = 500;
      const containerHeight = 500;
      const app = new PIXI.Application({
        width: containerWidth,
        height: containerHeight,
      });
      app.stage = new PIXILAYERS.Stage();

      const data = {
        grid: grid,
        entities: [],
        visuals: [],
        events: [],
      } as SimulationData;
      const context = createContext(app, data);
      expect(() => createGrid(context)).to.throw(
        'Area area51 is out of bounds: x + width > cols'
      );
    });

    it('should reject an area which is out of bounds at dimension y', () => {
      const grid = {
        areas: [
          {
            id: 'area51',
            name: 'ALIEN AREA',
            color: 0x1234af,
            gridDefinition: {
              width: 2,
              height: 6,
              x: 1,
              y: 1,
            },
          },
        ],
        cols: 5,
        rows: 5,
        width: 900,
        height: 1000,
      };

      const containerWidth = 500;
      const containerHeight = 500;
      const app = new PIXI.Application({
        width: containerWidth,
        height: containerHeight,
      });
      app.stage = new PIXILAYERS.Stage();
      const data = {
        grid: grid,
        entities: [],
        visuals: [],
        events: [],
      } as SimulationData;
      const context = createContext(app, data);
      expect(() => createGrid(context)).to.throw(
        'Area area51 is out of bounds: y + height > rows'
      );
    });
  });
});
