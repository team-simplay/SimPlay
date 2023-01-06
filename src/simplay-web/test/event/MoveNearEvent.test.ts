import { MoveNearEvent } from '../../src/event/MoveNearEvent';
import { expect } from 'chai';
import { MoveNearEventArgs } from '../../src/event/MoveNearEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { getTestGrid } from './getTestGrid';
import { instance, mock, when } from 'ts-mockito';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const targetId = 'bar';

describe('MoveNearEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new MoveNearEventArgs({ targetId: targetId });
    const event = new MoveNearEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.MOVE_NEAR);
    expect(event.args.targetId).to.equal(targetId);
  });

  const simData = {
    entities: [
      {
        id: 'leet',
        visual: 'LEET',
        type: 'CUSTOM',
        tint: 0x000000,
      },
      {
        id: 'bar',
        tint: 0x000000,
        visual: 'BAR',
        type: 'CUSTOM',
      },
    ],
    events: [],
    grid: getTestGrid(),
    visuals: [
      {
        id: 'LEET',
        frames: [TRANSPARENT_PIXEL],
      },
      {
        id: 'BAR',
        frames: [EMOJI],
      },
    ],
  } as SimulationDataSerialized;

  it('should move the entity near the target', async () => {
    const args = new MoveNearEventArgs({ targetId: targetId });
    const event = new MoveNearEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    when(containerMock.clientHeight).thenReturn(500);
    when(containerMock.clientWidth).thenReturn(500);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 10));
    getEntityDisplayObjectById(spooler.context, 'bar').container.position.set(
      2 * spooler.context.tileWidth + spooler.context.tileWidth / 2,
      2 * spooler.context.tileHeight + spooler.context.tileHeight / 2
    );
    event.execute(spooler.context);
    const targetPos = getEntityDisplayObjectById(spooler.context, 'bar')
      .container.position;

    const leetEntity = getEntityDisplayObjectById(spooler.context, 'leet');

    const entityPos = leetEntity.container.position;
    const entityHeight = leetEntity.container.getBounds().height;
    const entityWidth = leetEntity.container.getBounds().width;

    expect(entityPos.x).to.be.within(
      targetPos.x - spooler.context.tileWidth - entityWidth / 2,
      targetPos.x + spooler.context.tileWidth + entityWidth / 2
    );
    expect(entityPos.y).to.be.within(
      targetPos.y - spooler.context.tileHeight - entityHeight / 2,
      targetPos.y + spooler.context.tileHeight + entityHeight / 2
    );
  });
});
