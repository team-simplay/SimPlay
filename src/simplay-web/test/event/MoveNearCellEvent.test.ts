import { MoveNearCellEvent } from '../../src/event/MoveNearCellEvent';
import { expect } from 'chai';
import { MoveNearCellEventArgs } from '../../src/event/MoveNearCellEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, when } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const x = 1291;
const y = 187;

describe('MoveNearCellEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new MoveNearCellEventArgs({ x: x, y: y });
    const event = new MoveNearCellEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.MOVE_NEAR_CELL);
    expect(event.args.x).to.equal(x);
    expect(event.args.y).to.equal(y);
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

  it('should move the entity near the cell', async () => {
    const args = new MoveNearCellEventArgs({ x: 2, y: 2 });
    const event = new MoveNearCellEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    when(containerMock.clientHeight).thenReturn(500);
    when(containerMock.clientWidth).thenReturn(500);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    const targetCenterX =
      spooler.context.tileWidth * 2 + spooler.context.tileWidth / 2;
    const targetCenterY =
      spooler.context.tileHeight * 2 + spooler.context.tileHeight / 2;
    const entity = getEntityDisplayObjectById(spooler.context, forId);
    const entityPos = entity.container.position;
    const entityHeight = entity.container.getBounds().height;
    const entityWidth = entity.container.getBounds().width;

    // check that the entity is near the cell, within a range of 1 tile, adjusted for the entity's size
    expect(entityPos.x).to.be.within(
      targetCenterX - spooler.context.tileWidth - entityWidth / 2,
      targetCenterX + spooler.context.tileWidth + entityWidth / 2
    );
    expect(entityPos.y).to.be.within(
      targetCenterY - spooler.context.tileHeight - entityHeight / 2,
      targetCenterY + spooler.context.tileHeight + entityHeight / 2
    );
  });
});
