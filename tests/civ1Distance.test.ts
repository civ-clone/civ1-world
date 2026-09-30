import Tile from '@civ-clone/core-world/Tile';
import civ1Distance from '../lib/civ1Distance';
import { expect } from 'chai';

describe('civ1Distance', (): void => {
  const map = {
      width: (): number => 80,
      height: (): number => 50,
    },
    tile = (x: number, y: number): Tile =>
      ({
        map: () => map,
        x: (): number => x,
        y: (): number => y,
      } as unknown as Tile);

  (
    [
      [0, 0, 0, 0, 0],
      [0, 0, 5, 3, 6],
      [0, 0, 3, 5, 6],
      [10, 10, 5, 7, 6],
      [0, 0, 4, 0, 4],
      [0, 0, 0, 4, 4],
      [0, 0, 1, 1, 1],
      [0, 0, 20, 20, 30],
      // Wraps across the x edge: 2 across, not 78.
      [79, 10, 1, 10, 2],
      [1, 10, 79, 13, 4],
      // Doesn't wrap across the y edge.
      [10, 1, 10, 49, 48],
    ] as [number, number, number, number, number][]
  ).forEach(([x1, y1, x2, y2, expected]): void =>
    it(`should measure (${x1}, ${y1}) to (${x2}, ${y2}) as ${expected}`, (): void => {
      expect(civ1Distance(tile(x1, y1), tile(x2, y2))).to.equal(expected);
      expect(civ1Distance(tile(x2, y2), tile(x1, y1))).to.equal(expected);
    })
  );
});
