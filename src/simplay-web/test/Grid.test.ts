import { create } from '../src/Grid';
import * as PIXI from 'pixi.js';
import { expect } from 'chai';
import { mock, when, instance } from 'ts-mockito';

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
  };

  it('Should create a pixijs Application', () => {
    const containerWidth = 500;
    const containerHeight = 500;

    const containerMock = mock(HTMLElement);
    when(containerMock.clientWidth).thenReturn(containerWidth);
    when(containerMock.clientHeight).thenReturn(containerHeight);
    const container = instance(containerMock);

    const context = create(grid, container);
    expect(context.app).to.be.an.instanceof(PIXI.Application);
    expect(context.app.view.width).to.equal(containerWidth);
    expect(context.app.view.height).to.equal(containerHeight);
  });

  describe('context tests', () => {
    it('should calculate the correct tile size', () => {
      const containerWidth = 500;
      const containerHeight = 500;

      const containerMock = mock(HTMLElement);
      when(containerMock.clientWidth).thenReturn(containerWidth);
      when(containerMock.clientHeight).thenReturn(containerHeight);
      const container = instance(containerMock);

      const context = create(grid, container);
      expect(context.tileWidth).to.equal(containerWidth / grid.cols);
      expect(context.tileHeight).to.equal(containerHeight / grid.rows);
    });

    it('should create an areaContainer', () => {
      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      const context = create(grid, container);
      expect(context.areaContainer).to.be.an.instanceof(PIXI.Container);
      expect(context.areaContainer).to.equal(
        context.app.stage.getChildByName('areaContainer')
      );
    });

    it('should create an entityContainer', () => {
      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      const context = create(grid, container);
      expect(context.entityContainer).to.be.an.instanceof(PIXI.Container);
      expect(context.entityContainer).to.equal(
        context.app.stage.getChildByName('entityContainer')
      );
    });

    it('should create an interactionContainer', () => {
      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      const context = create(grid, container);
      expect(context.interactionContainer).to.be.an.instanceof(PIXI.Container);
      expect(context.interactionContainer).to.equal(
        context.app.stage.getChildByName('interactionContainer')
      );
    });
  });

  describe('area tests', () => {
    it('should create an area', () => {
      const containerWidth = 500;
      const containerHeight = 500;

      const containerMock = mock(HTMLElement);
      when(containerMock.clientWidth).thenReturn(containerWidth);
      when(containerMock.clientHeight).thenReturn(containerHeight);
      const container = instance(containerMock);

      const context = create(grid, container);
      const area51 = context.areaContainer.getChildByName('area-area51');
      expect(area51).to.be.an.instanceof(PIXI.Graphics);
      expect(area51.x).to.equal(100);
      expect(area51.y).to.equal(100);
    });

    it('should create an area label', () => {
      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      const context = create(grid, container);
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
      };

      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      expect(() => create(grid, container)).to.throw(
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
      };

      const containerMock = mock(HTMLElement);
      const container = instance(containerMock);

      expect(() => create(grid, container)).to.throw(
        'Area area51 is out of bounds: y + height > rows'
      );
    });
  });
});
