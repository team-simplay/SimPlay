import { expect } from 'chai';
import { instance, mock } from 'ts-mockito';
import { SimulationDataSerialized } from '../src/SimulationDataSerialized';
import { SimulationSpooler } from '../src/SimulationSpooler';

const simulationDataSerialized = {
  visuals: [
    {
      id: 'visual1',
      frames: ['frame1.png', 'frame2.png'],
    },
  ],
  entities: [
    {
      id: 'entity1',
      tint: 0x4512fa,
      type: 'CUSTOM',
      visual: 'visual1',
    },
  ],
  grid: {
    cols: 5,
    rows: 5,
    areas: [
      {
        id: 'area1',
        name: 'Area 1',
        color: 0x1234af,
        gridDefinition: {
          x: 1,
          y: 1,
          width: 2,
          height: 2,
        },
      },
    ],
  },
  events: [
    {
      action: 'SET_VISIBLE',
      forId: 'entity1',
      args: {
        visible: true,
      },
      timestamp: 0,
    },
  ],
} as SimulationDataSerialized;

describe('SimulationSpooler tests', function () {
  it('should create the context', () => {
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simulationDataSerialized, container);

    expect(spooler.context).to.not.be.undefined;
  });

  it('should create the Grid', () => {
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const simulationSpooler = new SimulationSpooler(
      simulationDataSerialized,
      container
    );

    expect(simulationSpooler.context.areaContainer.children.length).to.equal(2);
  });
});
