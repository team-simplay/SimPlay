import { MoveNearCellEvent } from '../../src/event/MoveNearCellEvent';
import { expect } from 'chai';
import { MoveNearCellEventArgs } from '../../src/event/MoveNearCellEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, spy, when } from 'ts-mockito';
import * as PIXI from 'pixi.js';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { DisplayEntity, getEntityDisplayObjectById } from '../../src/Entity';
import * as PIXILAYERS from '@pixi/layers';
import { InteractionLine } from '../../src/event/InteractionLine';
import { SimplayContext } from '../../src/SimplayContext';
import { SimulationData } from '../../src/SimulationData';

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('leet.png')).thenResolve(PIXI.Texture.WHITE);

describe('InteractionLine tests', async function () {
  const displayEntity1 = {
    animatedSprite: new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]),
    decoratingText: new PIXI.Text(''),
    container: new PIXI.Container(),
    outgoingInteractions: new Map(),
    incomingInteractions: new Map(),
  } as DisplayEntity;

  const displayEntity2 = {
    animatedSprite: new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]),
    decoratingText: new PIXI.Text(''),
    container: new PIXI.Container(),
    outgoingInteractions: new Map(),
    incomingInteractions: new Map(),
  } as DisplayEntity;

  it('should create a line between two entities', async () => {
    const pixiApp = new PIXI.Application();
    pixiApp.stage = new PIXILAYERS.Stage();

    pixiApp.stage.addChild(displayEntity1.container);
    pixiApp.stage.addChild(displayEntity2.container);

    displayEntity1.container.name = 'foo';
    displayEntity2.container.name = 'bar';

    displayEntity2.container.x = 0;
    displayEntity2.container.y = 100;

    const interactionContainer = new PIXI.Container();

    const context = {
      app: pixiApp,
      areaContainer: new PIXI.Container(),
      interactionContainer: interactionContainer,
      entityContainer: new PIXI.Container(),
      entityDictionary: {},
      simulationData: {
        entities: [],
        events: [],
        visuals: [],
        grid: getTestGrid(),
      } as SimulationData,
      tileHeight: 10,
      tileWidth: 10,
    } as SimplayContext;

    const line = new InteractionLine(displayEntity1, displayEntity2, context);
    expect(line.graphic.name).to.equal('foo -> bar');
    expect(line.graphic.parent).to.equal(interactionContainer);
    expect(line.graphic.x).to.equal(0);
    expect(line.graphic.y).to.equal(0);
    expect(line.graphic.width).to.equal(2);
    expect(line.graphic.height).to.equal(100);
  });
});
