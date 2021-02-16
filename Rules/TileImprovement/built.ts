import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry
) => Built[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): Built[] => [
  new Built(
    new Criterion((tile: Tile, tileImprovement: TileImprovement): boolean =>
      tileImprovementRegistry
        .getByTile(tile)
        .every(
          (existingTileImprovement: TileImprovement) =>
            tileImprovement.constructor !== existingTileImprovement.constructor
        )
    ),
    new Effect((tile: Tile, tileImprovement: TileImprovement): void =>
      tileImprovementRegistry.register(tileImprovement)
    )
  ),
  new Built(new Effect((tile: Tile): void => tile.clearYieldCache(null))),
];

export default getRules;
