import HexOddRTopology from '@civ-clone/core-world/HexOddRTopology';
import { ITopology } from '@civ-clone/core-world/Topology';
import SquareTopology from '@civ-clone/core-world/SquareTopology';
import StaggeredIsoTopology from '@civ-clone/core-world/StaggeredIsoTopology';
import Tile from '@civ-clone/core-world/Tile';
import civ1Distance from '../lib/civ1Distance';
import { expect } from 'chai';

type Pair = [number, number];

// The formula as it was before it measured over the world's logical axes, written out here so the square grid can be
// checked against it.
const storageDistance = (
    width: number,
    height: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    const directX = Math.abs(x1 - x2),
      directY = Math.abs(y1 - y2),
      dx = Math.min(directX, width - directX),
      dy = Math.min(directY, height - directY);

    return Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2);
  },
  longerPlusHalf = ([a, b]: Pair): number =>
    Math.max(Math.abs(a), Math.abs(b)) +
    Math.floor(Math.min(Math.abs(a), Math.abs(b)) / 2),
  // A staggered isometric tile's logical (a, b), written out independently of core-world.
  logical = (x: number, y: number): Pair => {
    const d = 2 * x + (((y % 2) + 2) % 2);

    return [(d + y) / 2, (y - d) / 2];
  },
  // The square formula over the logical offset, the shortest of every way round: the world wrapped up to twice each
  // way east to west, and north to south when it wraps.
  isoBruteForce = (
    width: number,
    height: number,
    wrapY: boolean,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    const [a1, b1] = logical(x1, y1);
    let best = Infinity;

    for (let i = -2; i <= 2; i++) {
      for (let j = wrapY ? -2 : 0; j <= (wrapY ? 2 : 0); j++) {
        const [a2, b2] = logical(x2 + i * width, y2 + j * height);

        best = Math.min(best, longerPlusHalf([a2 - a1, b2 - b1]));
      }
    }

    return best;
  },
  // A tile on a world with a real topology behind it.
  onTopology = (
    width: number,
    height: number,
    topology: ITopology
  ): ((x: number, y: number) => Tile) => {
    const world = {
      width: (): number => width,
      height: (): number => height,
      topology: (): ITopology => topology,
    };

    return (x: number, y: number): Tile =>
      ({
        map: () => world,
        x: (): number => x,
        y: (): number => y,
      } as unknown as Tile);
  };

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

  it('should run against a core-world that has logicalDelta', (): void => {
    // Otherwise the cases below would pass on the storage fallback without testing anything.
    expect(typeof new SquareTopology(1, 1).logicalDelta).to.equal('function');
    expect(typeof new StaggeredIsoTopology(2, 2).logicalDelta).to.equal(
      'function'
    );
  });

  it('should measure every pair on a square world exactly as before', (): void => {
    (
      [
        [1, 1],
        [2, 3],
        [7, 5],
        [6, 6],
        [5, 9],
        [8, 3],
        [13, 11],
      ] as Pair[]
    ).forEach(([width, height]): void => {
      const at = onTopology(width, height, new SquareTopology(width, height));

      for (let x1 = 0; x1 < width; x1++) {
        for (let y1 = 0; y1 < height; y1++) {
          for (let x2 = 0; x2 < width; x2++) {
            for (let y2 = 0; y2 < height; y2++) {
              expect(civ1Distance(at(x1, y1), at(x2, y2))).to.equal(
                storageDistance(width, height, x1, y1, x2, y2)
              );
            }
          }
        }
      }
    });
  });

  it('should measure from the corners and the middle of an 80x50 square world to every tile exactly as before', (): void => {
    const at = onTopology(80, 50, new SquareTopology(80, 50));

    (
      [
        [0, 0],
        [79, 0],
        [0, 49],
        [79, 49],
        [40, 25],
        [13, 37],
      ] as Pair[]
    ).forEach(([x1, y1]): void => {
      for (let x2 = 0; x2 < 80; x2++) {
        for (let y2 = 0; y2 < 50; y2++) {
          expect(civ1Distance(at(x1, y1), at(x2, y2))).to.equal(
            storageDistance(80, 50, x1, y1, x2, y2)
          );
        }
      }
    });
  });

  it('should measure every pair on a staggered isometric world as the square formula over their logical offset', (): void => {
    (
      [
        [3, 2, true],
        [4, 4, true],
        [5, 6, true],
        [6, 8, true],
        [7, 10, true],
        [5, 7, false],
        [6, 6, false],
      ] as [number, number, boolean][]
    ).forEach(([width, height, wrapY]): void => {
      const topology = new StaggeredIsoTopology(width, height, wrapY),
        at = onTopology(width, height, topology);

      expect(topology.wrapsY()).to.equal(wrapY);

      for (let x1 = 0; x1 < width; x1++) {
        for (let y1 = 0; y1 < height; y1++) {
          for (let x2 = 0; x2 < width; x2++) {
            for (let y2 = 0; y2 < height; y2++) {
              expect(civ1Distance(at(x1, y1), at(x2, y2))).to.equal(
                isoBruteForce(width, height, wrapY, x1, y1, x2, y2)
              );
            }
          }
        }
      }
    });
  });

  (
    [
      // Storage rows are half a tile apart on screen: 10 rows straight down is 5 tiles `s`, 5 `se` and 5 `sw`, so
      // (5, 5) logically, 7 by the square formula. Storage x and y would have made it 10.
      [10, 10, 10, 20, 7],
      // One column east is one `e`, (1, -1) logically: a diagonal, 1.
      [10, 10, 11, 10, 1],
      // Across the east-west seam: column 79 to column 1 on the same row is two `e`, (2, -2), so 3.
      [79, 10, 1, 10, 3],
      // Across the north-south seam: row 49 to row 1 is two rows down, one `s`, (1, 1), so 1.
      [10, 49, 10, 1, 1],
      // Across both: (79, 49) to (0, 0) is one `se`, (1, 0), so 1.
      [79, 49, 0, 0, 1],
      // Across both, further: (78, 48) to (1, 2) is two `s` and three `e`: (5, -1), so 5.
      [78, 48, 1, 2, 5],
    ] as [number, number, number, number, number][]
  ).forEach(([x1, y1, x2, y2, expected]): void =>
    it(`should measure (${x1}, ${y1}) to (${x2}, ${y2}) on an 80x50 staggered isometric world as ${expected}`, (): void => {
      const topology = new StaggeredIsoTopology(80, 50),
        at = onTopology(80, 50, topology);

      expect(topology.wrapsY()).to.equal(true);
      expect(isoBruteForce(80, 50, true, x1, y1, x2, y2)).to.equal(expected);
      expect(civ1Distance(at(x1, y1), at(x2, y2))).to.equal(expected);
      expect(civ1Distance(at(x2, y2), at(x1, y1))).to.equal(expected);
    })
  );

  it('should fall back to storage x and y on a hexagonal world, which has no square axes', (): void => {
    const at = onTopology(10, 8, new HexOddRTopology(10, 8));

    for (let x1 = 0; x1 < 10; x1++) {
      for (let y1 = 0; y1 < 8; y1++) {
        for (let x2 = 0; x2 < 10; x2++) {
          for (let y2 = 0; y2 < 8; y2++) {
            expect(civ1Distance(at(x1, y1), at(x2, y2))).to.equal(
              storageDistance(10, 8, x1, y1, x2, y2)
            );
          }
        }
      }
    }
  });
});
