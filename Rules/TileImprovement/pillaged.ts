import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';

export const getRules: (
  tileImprovementRegistry: TileImprovementRegistry
) => Pillaged[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): Pillaged[] => [
  new Pillaged(
    new Criterion((tile: Tile, tileImprovement: TileImprovement): boolean =>
      tileImprovementRegistry.getByTile(tile).includes(tileImprovement)
    ),
    new Effect((tile: Tile, tileImprovement: TileImprovement): void =>
      tileImprovementRegistry.unregister(tileImprovement)
    )
  ),
  new Pillaged(new Effect((tile: Tile): void => tile.clearYieldCache(null))),
];

export default getRules;
