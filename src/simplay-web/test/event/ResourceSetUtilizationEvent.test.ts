import { ResourceSetUtilizationEvent } from '../../src/event/ResourceSetUtilizationEvent';
import { expect } from 'chai';
import { ResourceSetUtilizationEventArgs } from '../../src/event/ResourceSetUtilizationEventArgs';
import { EventAction } from '../../src/event/EventAction';

const forId = 'leet';
const timestamp = 1337;
const utilization = 0.78;

describe('ResourceSetUtilizationEvent tests', function () {
  it('should have initialized correctly', () => {
    const args = new ResourceSetUtilizationEventArgs({
      utilization: utilization,
    });
    const event = new ResourceSetUtilizationEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.RESOURCE_SET_UTILIZATION);
    expect(event.args.utilization).to.equal(utilization);
  });
});
