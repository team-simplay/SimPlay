import { SetPositionEvent } from '../../src/event/SetPositionEvent';
import { expect } from 'chai';
import { SetPositionEventArgs } from '../../src/event/SetPositionEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { mock, instance, spy, when } from 'ts-mockito';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import * as PIXI from 'pixi.js';

const forId = 'leet';
const timestamp = 1337;

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('leet.png')).thenResolve(PIXI.Texture.WHITE);

describe('SetPositionEvent tests', async function () {
  const simulationDataSerialized = {
    entities: [
      {
        id: 'leet',
        type: 'CUSTOM',
        visual: 'LEET',
        tint: 0x000000,
      },
    ],
    events: [
      {
        forId: 'leet',
        timestamp: 1337,
        action: 'SET_VISIBLE',
        args: {
          visible: true,
        },
      },
    ],
    visuals: [
      {
        id: 'LEET',
        frames: ['leet.png'],
      },
    ],
    grid: getTestGrid(),
  } as SimulationDataSerialized;

  it('should initialize correctly', () => {
    const args = new SetPositionEventArgs({ x: 0, y: 0 });
    const event = new SetPositionEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_POSITION);
    expect(event.args.x).to.equal(0);
    expect(event.args.y).to.equal(0);
  });

  it('should execute correctly', async () => {
    const args = new SetPositionEventArgs({ x: 1, y: 1 });
    const event = new SetPositionEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    when(containerMock.clientHeight).thenReturn(500);
    when(containerMock.clientWidth).thenReturn(500);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simulationDataSerialized, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    expect(spooler.context.entityContainer.children[0].x).to.equal(
      spooler.context.tileWidth + spooler.context.tileWidth / 2
    );
    expect(spooler.context.entityContainer.children[0].y).to.equal(
      spooler.context.tileHeight + spooler.context.tileHeight / 2
    );
  });
});
