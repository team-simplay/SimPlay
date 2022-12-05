import { SimulationDataSerialized } from '../src/SimulationDataSerialized';
import { simulationDataFactory, SimulationData } from '../src/SimulationData';
import { expect } from 'chai';

describe('SimulationData tests', function () {
  it('should initialize correctly', () => {
    const serialized = {
      events: [
        {
          forId: 'leet',
          timestamp: 1337,
          action: 'STORE.SET_CAPACITY',
          args: {
            capacity: 1854,
          },
        },
      ],
      visuals: [
        {
          id: 'leet',
          frames: ['some.png'],
        },
      ],
      entities: [
        {
          id: 'leetentity',
          visual: 'leetsprite',
          type: 'CUSTOM',
          tint: 0x000000,
        },
      ],
      grid: {
        width: 0,
        height: 0,
        rows: 0,
        cols: 0,
        areas: [],
      },
    } as SimulationDataSerialized;
    const data = simulationDataFactory(serialized);
    expect(data.events).to.deep.equal(serialized.events);
    expect(data.visuals).to.deep.equal(serialized.visuals);
    expect(data.entities).to.deep.equal(serialized.entities);
    expect(data.grid).to.deep.equal(serialized.grid);
  });
});
