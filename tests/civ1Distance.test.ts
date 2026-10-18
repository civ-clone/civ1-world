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
      // Wraps across the y edge too: 2 across, not 48 (civ-clone/web-renderer#437).
      [10, 1, 10, 49, 2],
      [10, 0, 12, 47, 4],
    ] as [number, number, number, number, number][]
  ).forEach(([x1, y1, x2, y2, expected]): void =>
    it(`should measure (${x1}, ${y1}) to (${x2}, ${y2}) as ${expected}`, (): void => {
      expect(civ1Distance(tile(x1, y1), tile(x2, y2))).to.equal(expected);
      expect(civ1Distance(tile(x2, y2), tile(x1, y1))).to.equal(expected);
    })
  );

  it('should measure Vichy, 5 squares across the seam from Paris, as 5 rather than 60 (civ-clone/web-renderer#437)', (): void => {
    const world = { width: (): number => 104, height: (): number => 65 },
      at = (x: number, y: number): Tile =>
        ({ map: () => world, x: () => x, y: () => y } as unknown as Tile);

    expect(civ1Distance(at(33, 63), at(32, 3))).to.equal(5);
  });
});
