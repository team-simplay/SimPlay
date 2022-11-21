import { create } from '../src/Grid';
import * as PIXI from 'pixi.js';
import { expect } from 'chai';
import { mock, when, instance } from 'ts-mockito';

describe('Grid tests', function () {
  const grid = {
    areas: [
      {
        id: 'gridId',
        name: 'gridName',
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
    const containerHeight = 400;

    const containerMock = mock(HTMLElement);
    when(containerMock.clientWidth).thenReturn(containerWidth);
    when(containerMock.clientHeight).thenReturn(containerHeight);
    const container = instance(containerMock);

    const app = create(grid, container);
    expect(app).to.be.an.instanceof(PIXI.Application);
    expect(app.view.width).to.equal(containerWidth);
    expect(app.view.height).to.equal(containerHeight);
  });

  it('Should create tiles', () => {
    const containerMock = mock(HTMLElement);
    const container = instance(containerMock);

    const app = create(grid, container);
    expect(app.stage.getChildByName('area-0-0', true)).to.be.an.instanceof(
      PIXI.Graphics
    );
  });
});
