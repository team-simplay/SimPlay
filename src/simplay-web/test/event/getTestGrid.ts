import { SimplayGrid } from '../../src/SimplayGrid';

export function getTestGrid(): SimplayGrid {
  return {
    cols: 10,
    rows: 10,
    areas: [
      {
        id: 'area51',
        name: 'ALIEN AREA',
        color: 0x000000,
        gridDefinition: {
          width: 10,
          height: 10,
          x: 0,
          y: 0,
        },
      },
    ],
  };
}
