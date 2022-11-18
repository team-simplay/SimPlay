// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { SimPlayHostModel } from '..';

describe('Example', () => {
  describe('SimPlayHostModel', () => {
    it('should be createable', () => {
      const model = createTestModel(SimPlayHostModel);
      expect(model).toBeInstanceOf(SimPlayHostModel);
      expect(model.get('simulationdata')).toEqual('{}');
    });

    it('should be createable with a value', () => {
      const state = { simulationdata: '{}' };
      const model = createTestModel(SimPlayHostModel, state);
      expect(model).toBeInstanceOf(SimPlayHostModel);
      expect(model.get('simulationdata')).toEqual('{}');
    });
  });
});
