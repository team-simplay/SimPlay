import { expect } from 'chai';
import { instance, mock } from 'ts-mockito';
import { SimulationDataSerialized } from '../src/SimulationDataSerialized';
import { SimulationSpooler } from '../src/SimulationSpooler';
import { SimplayContext } from '../src/SimplayContext';
import { EMOJI, TRANSPARENT_PIXEL } from './event/testImages';

const simulationDataSerialized = {
  visuals: [
    {
      id: 'visual1',
      frames: [TRANSPARENT_PIXEL, EMOJI],
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

describe('SimulationSpooler tests', async function () {
  describe('Intialization tests', function () {
    it('should create the context', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(spooler.context).to.not.be.undefined;
    });

    it('should create the Grid', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const simulationSpooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(simulationSpooler.context.areaContainer.children.length).to.equal(
        2
      );
    });
  });
  describe('speedFactor tests', function () {
    it('should set, and return the correct speedFactor', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      const retVal = spooler.setSpeedFactor(2);
      expect(retVal).to.equal(2);
    });

    it('should refuse to set a speedFactor to 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.setSpeedFactor(0)).to.throw(
        'Speed factor must be greater than 0'
      );
    });

    it('should refuse to set a speedFactor to below 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.setSpeedFactor(-1)).to.throw(
        'Speed factor must be greater than 0'
      );
    });

    it('should increase the speedFactor correctly', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      const retVal1 = spooler.increaseSpeed(0.5);
      expect(retVal1).to.equal(1.5);
      const retVal2 = spooler.increaseSpeed(0.5);
      expect(retVal2).to.equal(2);
    });

    it('should refuse to increase the speedFactor to 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.increaseSpeed(-1)).to.throw(
        'Speed factor must be greater than 0'
      );
    });

    it('should refuse to increase the speedFactor to below 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.increaseSpeed(-2)).to.throw(
        'Speed factor must be greater than 0'
      );
    });

    it('should decrease the speedFactor correctly', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      const retVal1 = spooler.decreaseSpeed(0.5);
      expect(retVal1).to.equal(0.5);
      const retVal2 = spooler.decreaseSpeed(0.25);
      expect(retVal2).to.equal(0.25);
    });

    it('should refuse to decrease the speedFactor to 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.decreaseSpeed(1)).to.throw(
        'Speed factor must be greater than 0'
      );
    });

    it('should refuse to decrease the speedFactor to below 0', () => {
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(
        simulationDataSerialized,
        container
      );

      expect(() => spooler.decreaseSpeed(2)).to.throw(
        'Speed factor must be greater than 0'
      );
    });
  });

  describe('play tests', async function () {
    it('should spool the simulation', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let timesCalled = 0;
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        timesCalled++;
      };
      spooler.setSpeedFactor(100);
      await spooler.run();
      expect(timesCalled).to.equal(1);
    });

    it('should not execute all events at once', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 10,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setTimeout(() => {
        spooler.pause();
      }, 100);
      let timesCalledFirst = 0;
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        timesCalledFirst++;
      };
      let timesCalledSecond = 0;
      spooler.context.simulationData.events[1].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        timesCalledSecond++;
      };

      // this fire and forget is intentional, we're requestion to pause soon
      spooler.run();
      expect(timesCalledFirst).to.equal(1);
      expect(timesCalledSecond).to.equal(0);
    });

    it('should skip until the requested, but not further', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 1,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 2,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 3,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let eventsWithinRangeCalled = 0;
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventsWithinRangeCalled++;
      };
      spooler.context.simulationData.events[1].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventsWithinRangeCalled++;
      };
      spooler.context.simulationData.events[2].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventsWithinRangeCalled++;
      };
      let eventNotWithinRangeCalled = 0;
      spooler.context.simulationData.events[3].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventNotWithinRangeCalled++;
      };

      await spooler.skipTo(2);
      expect(eventsWithinRangeCalled).to.equal(3);
      expect(eventNotWithinRangeCalled).to.equal(0);
    });

    it('should stop spooling when the maximum timestamp is reached', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 10,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      spooler.setSpeedFactor(100);
      await spooler.run();
      // this test does not need any assertions, it's just to make sure that the
      // spooler does not run forever
    });

    it('should advance one step when requested', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 10,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let eventsWithinRangeCalled = 0;
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventsWithinRangeCalled++;
      };
      let eventNotWithinRangeCalled = 0;
      spooler.context.simulationData.events[1].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        eventNotWithinRangeCalled++;
      };
      await spooler.advanceOneStep();
      expect(eventsWithinRangeCalled).to.equal(1);
      expect(eventNotWithinRangeCalled).to.equal(0);
    });

    it('should reset when the skipTo Frame is before the current frame', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 10,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let resetCalled = 0;
      spooler.setSpeedFactor(100);
      spooler.reset = async () => {
        resetCalled++;
      };
      await spooler.advanceOneStep();
      await spooler.advanceOneStep();
      await spooler.advanceOneStep();
      await spooler.skipTo(0);
      expect(resetCalled).to.equal(1);
    });

    it('should wait for the current step to finish when resetting', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 1,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 2,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      // setting the speedFactor to 2 makes one step take 500ms
      spooler.setSpeedFactor(2);
      let firstEventCalled = 0;
      let secondEventCalled = 0;
      let thirdEventCalled = 0;
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        firstEventCalled++;
      };
      spooler.context.simulationData.events[1].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        secondEventCalled++;
      };
      spooler.context.simulationData.events[2].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        thirdEventCalled++;
      };
      // requesting the stop after 750ms should let the first two events execute
      // but not the third one
      setTimeout(() => {
        spooler.reset();
      }, 750);
      // this fire and forget is intentional, we're resetting the spooler soon
      spooler.run();

      // wait for the previous setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(firstEventCalled).to.equal(1);
      expect(secondEventCalled).to.equal(1);
      expect(thirdEventCalled).to.equal(0);
    });

    it('should reset all entities when resetting, and leave the state as it was originally', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 2,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      spooler.setSpeedFactor(10);
      let firstEventCalled = 0;
      let secondEventCalled = 0;
      const displayEntity = spooler.context.entityDictionary.get('entity1');
      spooler.context.simulationData.events[0].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        firstEventCalled++;
        // manually set visibility so that resetting has an effect
        if (displayEntity) {
          displayEntity.container.visible = true;
        }
      };
      spooler.context.simulationData.events[1].execute = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: SimplayContext
      ) => {
        secondEventCalled++;
      };
      await spooler.run();
      await spooler.reset();
      expect(firstEventCalled).to.equal(1);
      expect(secondEventCalled).to.equal(1);
      if (displayEntity) {
        expect(displayEntity.container.visible).to.equal(false);
      } else {
        expect.fail('Entity not found');
      }
      // run the spooler again to ensure, that the events are executed again
      await spooler.run();
      expect(firstEventCalled).to.equal(2);
      expect(secondEventCalled).to.equal(2);
      if (displayEntity) {
        expect(displayEntity.container.visible).to.equal(true);
      } else {
        expect.fail('Entity not found');
      }
    });

    it('should notify registered listeners when the simulationstep changes', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 2,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      spooler.setSpeedFactor(10);
      let firstListenerCalled = 0;
      let secondListenerCalled = 0;
      spooler.addStepChangedEventListener(() => {
        firstListenerCalled++;
      });
      spooler.addStepChangedEventListener(() => {
        secondListenerCalled++;
      });
      await spooler.advanceOneStep();
      expect(firstListenerCalled).to.equal(1);
      expect(secondListenerCalled).to.equal(1);
    });

    it('should not notify unregistered listeners when the simulationstep changes', async () => {
      const events = [
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: true,
          },
          timestamp: 0,
        },
        {
          action: 'SET_VISIBLE',
          forId: 'entity1',
          args: {
            visible: false,
          },
          timestamp: 2,
        },
      ];

      const simData = {
        ...simulationDataSerialized,
        events,
      } as SimulationDataSerialized;
      const containerMock = mock(HTMLDivElement);
      const container = instance(containerMock);
      const spooler = new SimulationSpooler(simData, container);
      await new Promise((resolve) => setTimeout(resolve, 100));
      spooler.setSpeedFactor(10);
      let firstListenerCalled = 0;
      let secondListenerCalled = 0;
      spooler.addStepChangedEventListener(() => {
        firstListenerCalled++;
      });
      const secondListener = () => {
        secondListenerCalled++;
      };
      spooler.addStepChangedEventListener(secondListener);
      await spooler.advanceOneStep();
      spooler.removeStepChangedEventListener(secondListener);
      await spooler.advanceOneStep();
      expect(firstListenerCalled).to.equal(2);
      expect(secondListenerCalled).to.equal(1);
    });
  });
});
